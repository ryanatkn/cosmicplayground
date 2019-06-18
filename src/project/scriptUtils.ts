import * as minimist from 'minimist';
import {red, yellow, white, gray, bold, black, bgYellow} from 'kleur';
import * as kleur from 'kleur';
import * as fs from 'fs';
import * as fp from 'path';

export const argv = minimist(process.argv.slice(2));
export const {dry, verbose} = argv;

// TODO change to `logVerbose` and accept the `verbose` flag?
export const verboseLog = (...args: any[]): void => {
	if (!verbose) return;
	console.log(...args);
};

export const logWarn = (prefix: string) => (
	message: string,
	...args: any[]
) => {
	console.log(
		prefix,
		bold(black(bgYellow(' warning '))),
		yellow(message),
		...args,
	);
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

export const extractFilename = (path: string): string =>
	replaceExt(fp.basename(path), '');

export const formatMs = (ms: number, decimals = 1): string => {
	const mult = Math.pow(10, decimals);
	return white((Math.round(ms * mult) / mult).toFixed(decimals)) + gray('ms');
};
