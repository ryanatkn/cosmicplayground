import * as minimist from 'minimist';
import {red, yellow} from 'kleur';
import * as kleur from 'kleur';
import * as fs from 'fs';
import * as fp from 'path';

import {logger, LogLevel} from './logger';
import {round} from '../utils/math';

export const argv = minimist(process.argv.slice(2));
export const {dry} = argv;

export const handleScriptError = (err: Error): void => {
	const {error} = logger(LogLevel.Error, [red('[handleScriptError]')]);
	error(err.stack ? yellow(err.stack) : yellow(`Error: ${err.message}`));
	process.exit(1);
};

const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'] as const;
export const rainbow = (str: string): string =>
	str
		.split('')
		.map((char, i) => kleur[colors[i % colors.length]](char))
		.join('');

export const cwd = fs.realpathSync(process.cwd());
export const resolvePath = (relativePath: string): string =>
	fp.resolve(cwd, relativePath);

export const replaceExt = (path: string, ext: string): string =>
	path.slice(0, -fp.extname(path).length) + ext;

export const extractFilename = (path: string): string =>
	replaceExt(fp.basename(path), '');

export const timeTracker = (decimals = 2) => {
	let start = process.hrtime.bigint();
	return (reset = true): number => {
		const end = process.hrtime.bigint();
		const elapsed = round(Number(end - start) / 1000000, decimals);
		if (reset) start = process.hrtime.bigint();
		return elapsed;
	};
};
