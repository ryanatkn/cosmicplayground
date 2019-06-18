import {Plugin} from 'rollup';
import {gray, green} from 'kleur';

import {assignDefaults} from '../../utils/obj';
import {noop} from '../../utils/fn';

export interface PluginOptions {
	verbose: boolean;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultOptions = (): PluginOptions => ({
	verbose: false,
});

const name = 'diagnostics';

export const diagnosticsPlugin = (
	pluginOptions: InitialPluginOptions = {},
): Plugin => {
	const {verbose} = assignDefaults(defaultOptions(), pluginOptions);
	const log = verbose
		? (...args: any[]): void => {
				console.log(gray(`[${name}]`), ...args);
		  }
		: noop;

	return {
		name,
		// banner() {}
		buildStart() {
			log(green('buildStart'));
		},
		buildEnd() {
			log(green('buildEnd'));
		},
		// footer() {}
		generateBundle(_outputOptions, _bundle, _isWrite) {
			log(green('generateBundle'), _isWrite);
		},
		// intro() {}
		load(id) {
			log(green('load'), gray(id));
			return null;
		},
		// options(o) {
		// 	log(green('options'), o);
		// 	return null;
		// },
		// outputOptions(o) {
		// 	log(green('outputOptions'), o);
		// 	return null;
		// },
		// outro() {}
		// renderChunk(_code, _chunk, _options) {}
		// renderError(_error) {}
		renderStart() {
			log(green('renderStart'));
		},
		// resolveDynamicImport(_specifier, _importer) {}
		// resolveFileUrl(_asset) {}
		resolveId(importee, _importer) {
			log(
				green('resolveId'),
				gray(importee),
				// (_importer && gray(_importer)) || '',
			);
			return null;
		},
		// resolveImportMeta(_property, _asset) {}
		transform(_code, id) {
			log(green('transform'), gray(id));
			return null;
		},
		watchChange(id) {
			log(green('watchChange'), gray(id));
		},
		// writeBundle(_bundle) {}
	};
};
