import {red, yellow, gray, black, bgYellow, bgRed, white} from 'kleur';

import {noop} from '../utils/fn';

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

export const logger = (
	level: LogLevel,
	prefixes: any[] = [],
	suffixes: any[] = [],
): Logger => {
	const log = (levelPrefixes: any[], levelSuffixes: any[] = []) => (
		...args: any[]
	) => {
		console.log(
			...levelPrefixes,
			...prefixes,
			...args,
			...suffixes,
			...levelSuffixes,
		);
	};
	return {
		trace: LogLevel.Trace >= level ? log([gray('-')]) : noop,
		info: LogLevel.Info >= level ? log([gray('➤')]) : noop,
		warn:
			LogLevel.Warn >= level
				? log(
						[yellow('➤'), black(bgYellow(' ⚑ warning ⚑ ')), yellow('➤')],
						[black(bgYellow(' ⚑ '))],
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

export const logVal = (key: string, val: string | number): string =>
	gray(`${key}(`) + val + gray(')');

export const logMs = (ms: number, decimals = 1): string => {
	const mult = Math.pow(10, decimals);
	return white((Math.round(ms * mult) / mult).toFixed(decimals)) + gray('ms');
};
