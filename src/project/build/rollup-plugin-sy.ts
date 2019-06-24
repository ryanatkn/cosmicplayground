import {Plugin} from 'rollup';
import {cyan, gray, yellow} from 'kleur';
import {createFilter} from 'rollup-pluginutils';
import * as prettier from 'prettier';

import {assignDefaults} from '../../utils/obj';
import {replaceExt} from '../scriptUtils';
import {logger, LogLevel, Logger, fmtCauses} from '../logger';
import {sy, SyBuild, SyConfig, CssClass} from '../../sy/sy';
import {removeClasses} from '../../sy/helpers';
import {CssBuild} from './rollup-plugin-plain-css';

export interface PluginOptions {
	dev: boolean;
	cacheCss(id: string, css: string | CssBuild): boolean;
	getUsedCssClasses?: () => Set<string>;
	getDefinedCssClasses?: () => Set<string>;
	include: string | RegExp | (string | RegExp)[] | null | undefined;
	exclude: string | RegExp | (string | RegExp)[] | null | undefined;
	removeUnusedClasses: boolean;
	warnUndefinedClasses: boolean;
	cssExt: string;
	configs: Map<string, SyConfig>;
	builds: Map<string, SyBuild>;
	prettierOptions: prettier.Options;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'dev' | 'cacheCss';
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
	getUsedCssClasses: undefined,
	getDefinedCssClasses: undefined,
	include: ['src/**/sy.config.ts'],
	exclude: undefined,
	removeUnusedClasses: !dev,
	warnUndefinedClasses: true,
	cssExt: '.css',
	configs: new Map<string, SyConfig>(),
	builds: new Map<string, SyBuild>(),
	prettierOptions: {},
	logLevel: LogLevel.Warn,
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
		getUsedCssClasses,
		getDefinedCssClasses,
		include,
		exclude,
		removeUnusedClasses,
		warnUndefinedClasses,
		cssExt,
		configs,
		builds,
		prettierOptions,
		logLevel,
	} = assignDefaults(defaultPluginOptions(pluginOptions), pluginOptions);

	const log = logger(logLevel, [cyan(`[${name}]`)]);
	const {info, warn} = log;

	const filter = createFilter(include, exclude);

	const changedCssIds = new Set<string>();

	return {
		name,
		// TODO make sure these are kept in sync when ids are removed/added
		configs,
		builds,
		async transform(_code, id) {
			if (!filter(id)) return null;
			info('transform', id);

			const cssId = replaceExt(id, cssExt);

			// TODO optimize - this reads from disk when we already have the source text. (`_code` arg)
			// how to execute the source script to ge the result? ts-node?
			const config = await createSyConfig(id, {}, log);
			info('setting new config', cssId);
			configs.set(cssId, config);
			changedCssIds.add(cssId); // not diffing the config here

			if (getDefinedCssClasses) {
				const definedClasses = getDefinedCssClasses();
				for (const def of config.defs) {
					if (def.type === 'class') definedClasses.add(def.className);
				}
			}

			return null;
		},
		generateBundle(_outputOptions, _bundle, isWrite) {
			// TODO is `!isWrite` actually the right time to do this?
			if (!isWrite) return;
			// TODO this optimization breaks tracking undefined classes watch mode
			// how can this be properly fixed? probably need to separate things out a bit
			// for now I'm leaving it broken until I understand the clean fix
			if (!changedCssIds.size) return;
			info('generateBundle', isWrite);
			for (const cssId of changedCssIds) {
				const config = configs.get(cssId);
				if (!config) throw Error(`Cannot find config for cssId ${cssId}`);

				// This relies on `classes` which isn't ready until
				// all svelte has been transformed,
				// so it needs to go here and not the `load` hook or `transform` hooks.

				info('creating sy build...');
				info('loaded config', cssId);

				const usedClasses = getUsedCssClasses && getUsedCssClasses();
				const hasClasses = usedClasses && !!usedClasses.size;

				// remove unused classes
				if (removeUnusedClasses && !getUsedCssClasses) {
					warn(
						'',
						'Option `removeUnusedClasses` is true but `getUsedCssClasses` is undefined.',
					);
				}
				if (removeUnusedClasses && !hasClasses) {
					warn(
						'',
						'Option `removeUnusedClasses` is true but no classes were provided.' +
							' Is the plugin providing `getUsedCssClasses` included in the build?',
					);
				}
				const finalConfig =
					usedClasses && removeUnusedClasses
						? removeClasses(config, usedClasses)
						: config;

				// warn about undefined classes
				if (warnUndefinedClasses && !hasClasses) {
					warn(
						'',
						'Option `warnUndefinedClasses` is true but no classes were provided.' +
							' Is the plugin providing `getUsedCssClasses` included in the build?',
					);
				}
				if (warnUndefinedClasses && !getDefinedCssClasses) {
					warn(
						'',
						'Option `warnUndefinedClasses` is true but `getDefinedCssClasses` is undefined.',
					);
				}
				if (usedClasses && warnUndefinedClasses && getDefinedCssClasses) {
					const definedClasses = getDefinedCssClasses();
					const undefinedClasses = toUndefinedClasses(
						usedClasses,
						definedClasses,
					);
					const {size} = undefinedClasses;
					if (size) {
						warn(
							`Undefined css class${size === 1 ? '' : 'es'}: ${yellow(
								Array.from(undefinedClasses).join(' '),
							)}` +
								fmtCauses([
									'misspelled class in markup or scripts',
									'misspelled or missing rule in css or sy config',
									'missing or broken css file import',
									'outdated/unused class that can be deleted :D',
								]),
						); // TODO better message - could standardize a format of "here are possible causes/solutions:"
					}
				}

				info(
					'final config\n',
					gray('  removing unused classes: ') +
						(!!usedClasses && removeUnusedClasses) +
						'\n',
					gray('  # generated classes: ') + config.defs.length + '\n',
					gray('  # svelte classes: ') +
						((usedClasses && usedClasses.size) || 0) +
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
		buildEnd() {
			if (!configs.size) {
				warn(`no sy config files were found`);
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
	log: Logger,
): Promise<SyConfig> => {
	delete require.cache[require.resolve(configPath)];
	const configModule: SyConfigModule = require(configPath);

	log.info('creating config...');
	const config = await configModule.createConfig(configPartial);
	log.info('created config');

	return config;
};

const createSyBuild = (
	config: SyConfig,
	format: boolean,
	log: Logger,
	prettierOptions: prettier.Options,
): SyBuild => {
	log.info('build styles...');
	const build = sy(config);
	log.info(
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
	log: Logger,
	prettierOptions: prettier.Options,
): SyBuild => {
	log.info('formatting...');
	const formatted = {
		...build,
		styles: prettier.format(build.styles, {parser: 'css', ...prettierOptions}),
	};
	log.info('format complete');
	return formatted;
};

// `undefinedClasses` are used but not defined.
// They're those that appear in the markup or script,
// but do not exist in the css or `sy` config.
const toUndefinedClasses = (
	usedClasses: Set<CssClass>,
	definedClasses: Set<CssClass>,
): Set<string> => {
	const undefinedClasses = new Set<string>();
	for (const c of usedClasses) {
		if (!definedClasses.has(c)) undefinedClasses.add(c);
	}
	return undefinedClasses;
};
