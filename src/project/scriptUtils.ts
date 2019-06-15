import * as minimist from 'minimist';
import {red, yellow} from 'kleur';
import * as kleur from 'kleur';
import * as fs from 'fs';
import * as fp from 'path';

export const argv = minimist(process.argv.slice(2));
export const {dry, verbose} = argv;

export const verboseLog = (...args: any[]): void => {
	if (!verbose) return;
	console.log(...args);
};

export const handleScriptError = (err: Error): void => {
	console.log(red(`Error: ${err.message}`));
	if (err.stack) console.log(yellow(err.stack));
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
