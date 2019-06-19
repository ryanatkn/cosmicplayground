import {Plugin} from 'rollup';
import {gray, green} from 'kleur';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger} from '../logger';

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
		resolveId(importee, _importer) {
			trace(
				green('resolveId'),
				gray(importee),
				// (_importer && gray(_importer)) || '',
			);
			return null;
		},
		// resolveImportMeta(_property, _asset) {}
		transform(_code, id) {
			trace(green('transform'), gray(id));
			return null;
		},
		watchChange(id) {
			trace(green('watchChange'), gray(id));
		},
		writeBundle(_bundle) {
			info('writeBundle');
		},
	};
};
