'use strict';

require('dotenv').config();

const {NODE_ENV, SERVER_USER, SERVER_IP, SERVER_SSH_PORT} = process.env;

if (NODE_ENV !== 'production') {
  throw Error(`Expected NODE_ENV to be 'production', not '${NODE_ENV}'`);
}
if (!SERVER_USER) throw Error('SERVER_USER env var is required for deployment');
if (!SERVER_IP) throw Error('SERVER_IP env var is required for deployment');

const fs = require('fs');
const fp = require('path');
const exec = require('child_process').exec;
const ck = require('chalk');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const dryRun = argv['dry-run'];
const verbose = argv['verbose'];

const paths = require('../paths');

// Make sure the build is ready
if (!fs.existsSync(paths.appBuildDistClient)) {
  throw Error(`Build directory does not exist: ${paths.appBuildDistClient}`);
}

const verboseLog = (...args) => {
  if (!verbose) return;
  console.log(...args);
};

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
const runDeploy = async () => {
  const command = createDeployCommand();

  if (dryRun) {
    console.log(ck.magenta('dryrun - skipping command execution'));
  } else {
    verboseLog(ck.magenta('executing deploy command'));
    const {stdout, stderr} = await new Promise((resolve, reject) => {
      exec(command, function(err, stdout, stderr) {
        if (err) {
          reject(err);
        } else {
          resolve({stdout, stderr});
        }
      });
    });
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  }
  console.log(
    [
      rainbow('~~~~~~~~~~~~~~~~~~'),
      rainbow('~~~! deployed !~~~'),
      rainbow('~~~~~~~~~~~~~~~~~~'),
    ].join('\n'),
  );

  if (dryRun) {
    console.log(ck.magenta('dry run complete'));
  }
};

const createDeployCommand = () => {
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
  verboseLog(ck.magenta(`deployment command`), command);

  return command;
};

const createPaths = () => {
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

// TODO extract into helpers?
const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
const rainbow = str =>
  str
    .split('')
    .map((char, i) => ck[colors[i % colors.length]](char))
    .join('');

runDeploy().catch(err => {
  console.error(err);
  throw err;
});
