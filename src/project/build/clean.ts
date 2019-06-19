import {magenta} from 'kleur';
import * as fs from 'fs-extra';

import {paths} from '../paths';
import {logger, LogLevel} from '../logger';

const {info} = logger(LogLevel.Trace, [magenta('[clean]')]);

export const clean = async () => {
	await cleanDist();
};

export const cleanDist = async () => {
	// clean up and prepare build directory
	info('cleaning up and preparing build dir');
	await fs.emptyDir(paths.appBuildDist);
};
