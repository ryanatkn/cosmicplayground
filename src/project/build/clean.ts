import ck from 'chalk';
import * as fs from 'fs-extra';

import {paths} from '../paths';
import {verboseLog} from '../scriptUtils';

export const clean = async () => {
	await cleanDist();
};

export const cleanDist = async () => {
	// clean up and prepare build directory
	verboseLog(ck.magenta('cleaning up and preparing build dir'));
	await fs.emptyDir(paths.appBuildDist);
};
