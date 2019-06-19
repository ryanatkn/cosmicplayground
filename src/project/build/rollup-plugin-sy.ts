import {Plugin} from 'rollup';
import {cyan, gray} from 'kleur';
import {createFilter} from 'rollup-pluginutils';
import * as prettier from 'prettier';

import {assignDefaults} from '../../utils/obj';
import {noop} from '../../utils/fn';
import {replaceExt, logWarn} from '../scriptUtils';
import {sy, SyBuild, SyConfig} from '../../sy/sy';
import {removeClasses} from '../../sy/helpers';
import {CssBuild} from './rollup-plugin-plain-css';

export interface PluginOptions {
	dev: boolean;
	cacheCss(id: string, css: string | CssBuild): boolean;
	getCssClasses: (() => Set<string>) | undefined;
	include: string | RegExp | (string | RegExp)[] | null | undefined;
	exclude: string | RegExp | (string | RegExp)[] | null | undefined;
	removeUnusedClasses: boolean;
	cssExt: string;
	configs: Map<string, SyConfig>;
	builds: Map<string, SyBuild>;
	prettierOptions: prettier.Options;
	verbose: boolean;
}
export type RequiredPluginOptions = 'dev' | 'cacheCss' | 'getCssClasses';
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = ({
	dev,
	cacheCss,
}: InitialPluginOptions): PluginOptions => ({
	dev,
	cacheCss,
	getCssClasses: undefined,
	include: ['src/**/sy.config.ts'],
	exclude: undefined,
	removeUnusedClasses: !dev,
	cssExt: '.css',
	configs: new Map<string, SyConfig>(),
	builds: new Map<string, SyBuild>(),
	prettierOptions: {},
	verbose: false,
});

export interface SyPlugin extends Plugin {
	configs: Map<string, SyConfig>;
	builds: Map<string, SyBuild>;
}

export const name = 'sy';

export const syPlugin = (pluginOptions: InitialPluginOptions): SyPlugin => {
	const {
		dev,
		cacheCss,
		getCssClasses,
		include,
		exclude,
		removeUnusedClasses,
		cssExt,
		configs,
		builds,
		prettierOptions,
		verbose,
	} = assignDefaults(defaultPluginOptions(pluginOptions), pluginOptions);

	const logTag = cyan(`[${name}]`);
	const warn = logWarn(logTag);
	const log = verbose
		? (...args: any[]): void => {
				console.log(logTag, ...args);
		  }
		: noop;

	const filter = createFilter(include, exclude);

	const changedCssIds = new Set<string>();

	return {
		name,
		// TODO make sure these are kept in sync when ids are removed/added
		configs,
		builds,
		resolveId(id) {
			if (!configs.has(id)) return null;
			return id;
		},
		load(id) {
			if (!configs.has(id)) return null;
			return ''; // TODO this prevents being able to import stuff, right?
			// return {code: '', config: configs.get(id)};
		},
		async transform(_code, id) {
			if (!filter(id)) return null;
			log('transform', id);

			const cssId = replaceExt(id, cssExt);

			// see `watchChange` hook for `changedById` tracking
			// this.addWatchFile(id);
			// if (!changedById.get(id)) {
			// 	const build = buildByCssId.get(id);
			// 	if (!build) throw Error(`Missing build for id '${id}'`);
			// 	log('load cached build');
			// 	return build.styles;
			// }
			// changedById.set(path, false);

			// TODO optimize - this reads from disk when we already have the source text. (`_code` arg)
			// how to execute the source script to ge the result? ts-node?
			const config = await createSyConfig(id, {}, log);
			log('setting new config', cssId);
			configs.set(cssId, config);
			changedCssIds.add(cssId); // not diffing the config here

			// TODO emit file when API is ready - https://github.com/rollup/rollup/issues/2938
			return ''; // TODO this prevents being able to import stuff, right?
		},
		generateBundle(_outputOptions, _bundle, isWrite) {
			// TODO is `!isWrite` actually the right time to do this?
			if (!isWrite || !changedCssIds.size) return;
			log('generateBundle', isWrite);
			for (const cssId of changedCssIds) {
				const config = configs.get(cssId);
				if (!config) throw Error(`Cannot find config for cssId ${cssId}`);

				// This relies on `classes` which isn't ready until
				// all svelte has been transformed,
				// so it needs to go here and not the `load` hook or `transform` hooks.

				log('load config', cssId);

				log('creating sy build...');
				const classes = getCssClasses && getCssClasses();
				if (removeUnusedClasses && !getCssClasses) {
					warn(
						'',
						'Option `removeUnusedClasses` is true but `getCssClasses` is undefined.',
					);
				}
				if (removeUnusedClasses && (!classes || !classes.size)) {
					warn(
						'',
						'Option `removeUnusedClasses` is true but no classes were provided.' +
							' Is the plugin providing `getCssClasses` included in the build?',
					);
				}
				const finalConfig =
					classes && removeUnusedClasses
						? removeClasses(config, classes)
						: config;
				log(
					'final config\n',
					gray('  removing unused classes: ') +
						(!!classes && removeUnusedClasses) +
						'\n',
					gray('  # generated classes: ') + config.defs.length + '\n',
					gray('  # svelte classes: ') +
						((classes && classes.size) || 0) +
						'\n',
					gray('  # used generated classes: ') + finalConfig.defs.length,
				);

				const build = createSyBuild(finalConfig, dev, log, prettierOptions);
				builds.set(cssId, build);
				// TODO rewrite when the emit file API is ready https://github.com/rollup/rollup/issues/2938
				cacheCss(cssId, build.styles);
			}
			changedCssIds.clear();
		},
		// watchChange(id: string) {
		// 	if (!paths.has(id)) return;
		// 	// Importantly, this `id` is the `path` to the script file,
		// 	// not the `id` referring to the css file used in the rest of the plugin.
		// 	// See `this.addWatchFile` in the `load` hook.
		// 	log('changed', id);
		// 	changedById.set(id, true);
		// },
		buildEnd() {
			if (!configs.size) {
				warn(logTag, `no sy config files were found`);
			}
		},
	};
};

// This type is the shape of the config file (e.g. `sy.config.ts`).
// It's used to get types for dynamic imports/requires.
interface SyConfigModule {
	// Callers may include a `configPartial` but any part of it can be ignored.
	// Callers can then further change the returned config if needed.
	createConfig(partial: Partial<SyConfig>): Promise<SyConfig>;
}

const createSyConfig = async (
	configPath: string,
	configPartial: Partial<SyConfig> = {},
	log = noop,
): Promise<SyConfig> => {
	delete require.cache[require.resolve(configPath)];
	const configModule: SyConfigModule = require(configPath);

	log('creating config...');
	const config = await configModule.createConfig(configPartial);
	log('created config');

	return config;
};

const createSyBuild = (
	config: SyConfig,
	format: boolean,
	log: typeof noop,
	prettierOptions: prettier.Options,
): SyBuild => {
	log('build styles...');
	const build = sy(config);
	log(
		`built styles
	# defs: ${build.defs.length}
	# lines: ${(build.styles.match(/\n/g) || []).length + 1}
	# characters: ${build.styles.length}`,
	);

	const formattedBuild = format
		? formatBuild(build, log, prettierOptions)
		: build;
	return formattedBuild;
};

const formatBuild = (
	build: SyBuild,
	log: typeof noop,
	prettierOptions: prettier.Options,
): SyBuild => {
	log('formatting...');
	const formatted = {
		...build,
		styles: prettier.format(build.styles, {parser: 'css', ...prettierOptions}),
	};
	log('format complete');
	return formatted;
};
