import * as dotenv from 'dotenv';
dotenv.config();
const {NODE_ENV, SERVER_USER, SERVER_IP, SERVER_SSH_PORT} = process.env;
if (NODE_ENV !== 'production') {
	throw Error(`Expected NODE_ENV to be 'production', not '${NODE_ENV}'`);
}
if (!SERVER_USER) throw Error('SERVER_USER env var is required for deployment');
if (!SERVER_IP) throw Error('SERVER_IP env var is required for deployment');

import * as fs from 'fs';
import * as fp from 'path';
import {exec} from 'child_process';
import ck from 'chalk';

import {dry, verboseLog, rainbow, handleScriptError} from '../scriptUtils';
import {paths} from '../paths';

// Make sure the build is ready
if (!fs.existsSync(paths.appBuildDistClient)) {
	throw Error(`Build directory does not exist: ${paths.appBuildDistClient}`);
}

/**
 * Prepares and executes deployment:
 * - zips up the dist directory
 * - copies the zipped dist to the server
 * - removes the previously deployed files on the server
 * - unzips the new dist on the server
 *
 * Note that this task does not build any project files.
 * Building and deploying are intentionally decoupled so that anything can be
 * directly deployed without special handling.
 */
const runDeploy = async (): Promise<void> => {
	const command = createDeployCommand();
	verboseLog(ck.magenta(`deployment command`), ck.cyan(command));

	if (dry) {
		console.log(ck.magenta('dry run - skipping command execution'));
	} else {
		verboseLog(ck.magenta('executing deploy command'));
		const {stdout, stderr} = await new Promise((resolve, reject) => {
			exec(command, (err, stdout, stderr) => {
				if (err) {
					reject(err);
				} else {
					resolve({stdout, stderr});
				}
			});
		});
		if (stdout) console.log(stdout);
		if (stderr) console.error(stderr);
		verboseLog(ck.magenta('executed deploy command'));
	}
};

const createDeployCommand = (): string => {
	const p = createPaths();

	const serverHost = `${SERVER_USER}@${SERVER_IP}`;
	const ssh = `ssh ${serverHost}${
		SERVER_SSH_PORT ? ` -p ${SERVER_SSH_PORT}` : ''
	}`;

	const createTarball = `tar -czf ${p.localTarball} -C ${
		paths.appBuild
	} ${fp.relative(paths.appBuild, paths.appBuildDist)}`;

	const scpTarball = `scp ${
		SERVER_SSH_PORT ? `-P ${SERVER_SSH_PORT}` : ''
	} -p ${p.localTarball} ${serverHost}:${p.remoteApp}`;

	const setupServer = [
		`rm -rf ${p.remoteDist}`,
		`tar -xzf ${p.remoteTarball} -C ${p.remoteApp}`,
	].join(' && ');

	const command = [createTarball, scpTarball, `${ssh} '${setupServer}'`].join(
		' && ',
	);

	return command;
};

const createPaths = (): Record<string, string> => {
	const remoteApp = '/var/www/cosmicplayground.org';
	const tarFileName = 'dist.tar.gz';

	const remoteDist = fp.join(
		remoteApp,
		fp.relative(paths.appBuild, paths.appBuildDist),
	);

	const p = {
		remoteApp,
		tarFileName,
		remoteDist,
		remoteDistClient: fp.join(
			remoteDist,
			fp.relative(paths.appBuildDist, paths.appBuildDistClient),
		),
		remoteTarball: fp.join(remoteApp, tarFileName),
		localTarball: fp.join(paths.appBuild, tarFileName),
	};
	verboseLog(ck.magenta('deployment paths'), p);
	return p;
};

runDeploy()
	.then(() => {
		console.log(
			[
				rainbow('~~~~~~~~~~~~~~~~~~'),
				rainbow('~~~! deployed !~~~'),
				rainbow('~~~~~~~~~~~~~~~~~~'),
			].join('\n'),
		);
		if (dry) console.log(ck.magenta('dry run complete'));
	})
	.catch(handleScriptError);
