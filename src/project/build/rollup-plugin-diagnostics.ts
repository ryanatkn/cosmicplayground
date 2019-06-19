import {Plugin} from 'rollup';
import {gray, green} from 'kleur';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger, fmtVal, fmtMs} from '../logger';
import {timeTracker} from '../scriptUtils';

export interface PluginOptions {
	logLevel: LogLevel;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultOptions = (): PluginOptions => ({
	logLevel: LogLevel.Info,
});

const name = 'diagnostics';

export const diagnosticsPlugin = (
	pluginOptions: InitialPluginOptions = {},
): Plugin => {
	const {logLevel} = assignDefaults(defaultOptions(), pluginOptions);
	const {trace, info} = logger(logLevel, [gray(`[${name}]`)]);

	const elapsedTotal = timeTracker(); // TODO combine with svelte timings

	// TODO consider returning 2 plugins, one to be put first and one to go last to track timings
	return {
		name,
		// banner() {}
		buildStart() {
			info(green('buildStart'));
		},
		buildEnd() {
			info(green('buildEnd'));
		},
		// footer() {}
		generateBundle(_outputOptions, _bundle, isWrite) {
			info(green('generateBundle'), {isWrite});
		},
		// intro() {}
		load(id) {
			trace(green('load'), gray(id));
			return null;
		},
		options(o) {
			trace(green('options'), o);
			return null;
		},
		// outputOptions(o) {
		// 	log(green('outputOptions'), o);
		// 	return null;
		// },
		// outro() {}
		// renderChunk(_code, _chunk, _options) {}
		// renderError(_error) {}
		renderStart() {
			info(green('renderStart'));
		},
		// resolveDynamicImport(_specifier, _importer) {}
		// resolveFileUrl(_asset) {}
		resolveId(importee, importer) {
			trace(
				green('resolveId'),
				gray(importee),
				(importer && gray('<- ' + importer)) || '',
			);
			return null;
		},
		// resolveImportMeta(_property, _asset) {}
		transform(code, id) {
			trace(
				green('transform'),
				gray(id),
				fmtVal('len', (code && code.length) || 0),
			);
			return null;
		},
		watchChange(id) {
			trace(green('watchChange'), gray(id));
		},
		writeBundle(_bundle) {
			info('writeBundle', fmtVal('totalElapsed', fmtMs(elapsedTotal())));
		},
	};
};
