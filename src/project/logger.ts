import {red, yellow, gray, black, bgYellow, bgRed, white} from 'kleur';

import {noop} from '../utils/fn';
import {round} from '../utils/math';

export type Log = (...args: any[]) => void;

export type Logger = {
	trace: Log;
	info: Log;
	warn: Log;
	error: Log;
};

export enum LogLevel {
	Trace,
	Info,
	Warn,
	Error,
}

export const logger = (level: LogLevel, prefixes: any[] = [], suffixes: any[] = []): Logger => {
	const log = (levelPrefixes: any[], levelSuffixes: any[] = []) => (...args: any[]) => {
		console.log(...levelPrefixes, ...prefixes, ...args, ...suffixes, ...levelSuffixes);
	};
	return {
		trace: LogLevel.Trace >= level ? log([gray('-')]) : noop,
		info: LogLevel.Info >= level ? log([gray('➤')]) : noop,
		warn:
			LogLevel.Warn >= level
				? log(
						[yellow('➤'), black(bgYellow(' ⚑ warning ⚑ ')), '\n' + yellow('➤')],
						['\n ', black(bgYellow(' ⚑ '))],
				  )
				: noop,
		error:
			LogLevel.Error >= level
				? log(
						[red('➤'), black(bgRed(' ✖✖ error ✖✖ ')), red('➤')],
						[black(bgRed(' ✖✖ error ✖✖ ')), black(bgRed(' ✖✖✖ '))],
				  )
				: noop,
	};
};

export const fmtVal = (key: string, val: string | number): string =>
	gray(`${key}(`) + val + gray(')');

export const fmtMs = (ms: number, decimals = 1): string => {
	return white(round(ms, decimals).toFixed(decimals)) + gray('ms');
};

export const fmtCauses = (solutions: string[]): string => {
	return '\n	Possible causes:' + solutions.map((s) => `\n		• ${s}`).join('');
};
