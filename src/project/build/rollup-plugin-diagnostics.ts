import {Plugin} from 'rollup';
import {gray, yellow} from 'kleur';

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
export const defaultPluginOptions = (): PluginOptions => ({
	logLevel: LogLevel.Info,
});

const name = 'diagnostics';

export const diagnosticsPlugin = (
	pluginOptions: InitialPluginOptions = {},
): Plugin => {
	const {logLevel} = assignDefaults(defaultPluginOptions(), pluginOptions);
	const {trace, info} = logger(logLevel, [gray(`[${name}]`)]);

	const elapsedTotal = timeTracker(); // TODO combine with svelte timings

	// TODO consider returning 2 plugins, one to be put first and one to go last to track timings
	return {
		name,
		// banner() {}
		buildStart() {
			info(yellow('buildStart'));
		},
		buildEnd() {
			info(yellow('buildEnd'));
		},
		// footer() {}
		generateBundle(_outputOptions, _bundle, isWrite) {
			info(yellow('generateBundle'), {isWrite});
		},
		// intro() {}
		load(id) {
			trace(yellow('load'), gray(id));
			return null;
		},
		options(o) {
			trace(yellow('options'), o);
			return null;
		},
		// outputOptions(o) {
		// 	log(yellow('outputOptions'), o);
		// 	return null;
		// },
		// outro() {}
		renderChunk(_code, chunk, _options) {
			info(
				yellow('renderChunk'),
				chunk.name,
				chunk.fileName,
				chunk.facadeModuleId && gray(chunk.facadeModuleId),
			);
			return null;
		},
		// renderError(_error) {}
		renderStart() {
			info(yellow('renderStart'));
		},
		// resolveDynamicImport(_specifier, _importer) {}
		// resolveFileUrl(_asset) {}
		resolveId(importee, importer) {
			trace(
				yellow('resolveId'),
				gray(importee),
				(importer && gray('<- ' + importer)) || '',
			);
			return null;
		},
		// resolveImportMeta(_property, _asset) {}
		transform(code, id) {
			trace(
				yellow('transform'),
				gray(id),
				fmtVal('len', (code && code.length) || 0),
			);
			return null;
		},
		watchChange(id) {
			trace(yellow('watchChange'), gray(id));
		},
		writeBundle(_bundle) {
			info(
				yellow('writeBundle'),
				fmtVal('totalElapsed', fmtMs(elapsedTotal())),
			);
		},
	};
};
