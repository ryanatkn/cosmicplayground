import {magenta} from 'kleur';
import * as fs from 'fs-extra';

import {paths} from '../paths';
import {verboseLog} from '../scriptUtils';

export const clean = async () => {
	await cleanDist();
};

export const cleanDist = async () => {
	// clean up and prepare build directory
	verboseLog(magenta('cleaning up and preparing build dir'));
	await fs.emptyDir(paths.appBuildDist);
};
