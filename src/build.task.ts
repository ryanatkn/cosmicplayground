import {Task} from '@feltcoop/gro/dist/task/task.js';
import {MapInputOptions} from '@feltcoop/gro/dist/project/build.js';
import {copy} from '@feltcoop/gro/dist/fs/nodeFs.js';
import {toDistId} from '@feltcoop/gro/dist/paths.js';
import {GroSveltePlugin} from '@feltcoop/gro/dist/project/rollup-plugin-gro-svelte.js';
import {join} from 'path';

import {paths} from './paths.js';
import {bundleWriterPlugin} from './project/build/rollup-plugin-bundle-writer.js';
import {extractPlainCssClassesPlugin} from './project/build/rollup-plugin-extract-plain-css-classes.js';
import {syPlugin} from './project/build/rollup-plugin-sy.js';
import {extractSvelteCssClassesPlugin} from './project/build/rollup-plugin-extract-svelte-css-classes.js';
import {LogLevel} from './project/logger.js';
import {createCssClassesCache} from './project/build/cssClassesCache.js';
import {outputCssPlugin} from './project/build/rollup-plugin-output-css.js';

export const task: Task = {
	description: 'build the project',
	run: async ({args, invokeTask}): Promise<void> => {
		(args as any).mapInputOptions = mapInputOptions;
		// (args as any).mapOutputOptions = (options: OutputOptions): OutputOptions => options;
		// (args as any).mapWatchOptions = (options: RollupWatchOptions): RollupWatchOptions => options;

		// TODO assets task
		await copy(paths.assets, toDistId(paths.assets)); // TODO should be with assets - also, import this path
		await copy(join(paths.source, 'index.html'), join(paths.dist, 'index.html')); // TODO should be with assets - also, import this path

		await invokeTask('gro/build');
	},
};

const mapInputOptions: MapInputOptions = (inputOptions, {dev, cssCache}) => {
	const oldPlugins = inputOptions.plugins!;
	const plainCssPluginIndex = oldPlugins.findIndex((p) => p.name === 'plain-css');
	const groOutputCssPluginIndex = oldPlugins.findIndex((p) => p.name === 'output-css')!;
	// TODO what's a better way to get plugins in a typesafe, ergonomic way, with good runtime errors?
	// ideally we don't resort to using classes
	const groSveltePluginInstance: GroSveltePlugin = oldPlugins.find(
		(p) => p.name === 'gro-svelte',
	) as any;

	// TODO do this correctly (and replace this project's logger with Gro's)
	const logLevel = LogLevel.Trace;

	// TODO do this correctly
	// const pkg = require('../../../package.json'); // TODO import differently?
	// const prettierOptions: prettier.Options = pkg.prettier;
	const prettierOptions = {
		useTabs: true,
		printWidth: 100,
		singleQuote: true,
		trailingComma: 'all',
		bracketSpacing: false,
		svelteSortOrder: 'scripts-markup-styles',
		svelteBracketNewLine: true,
		overrides: [
			{
				files: '*.json',
				options: {
					useTabs: false,
				},
			},
		],
	} as const;

	const removeUnusedClasses = !dev;
	const warnUndefinedClasses = true;

	const cssClasses = createCssClassesCache({logLevel});

	// TODO do we want to completely replace the Gro css plugin with this one?
	// maybe just to get it to work? and then figure out how to extend?
	// TODO consider using two separate css plugins
	// it's hard to tell if we'll ever want a single one to be able to coordinate multiple bundles
	oldPlugins[groOutputCssPluginIndex] = outputCssPlugin({
		getCssBundles: cssCache.getCssBundles,
		sourcemap: dev,
		cssClasses,
		logLevel,
	});
	const syCssBundleName = 'bundle.sy.css';
	const plainCssBundleName = 'bundle.plain.css'; // TODO how to get this from Gro? just make it an option?
	const cacheSyCss = cssCache.addCssBuild.bind(null, syCssBundleName);
	const getPlainCssBuild = cssCache.getCssBuild.bind(null, plainCssBundleName);
	const extractSvelteCssClassesPluginInstance =
		removeUnusedClasses || warnUndefinedClasses
			? extractSvelteCssClassesPlugin({
					cssClasses,
					getSvelteCompilation: groSveltePluginInstance.getCompilation,
					logLevel,
			  })
			: undefined;

	// TODO fix any type (rollup version mismatch? old plugins?)
	const plugins: any[] = [
		...oldPlugins.slice(0, plainCssPluginIndex + 1),

		// TODO this dependency on a similarly named peer is an obvious problem -
		// file emitting will probably fix
		...(extractSvelteCssClassesPluginInstance
			? [
					extractPlainCssClassesPlugin({
						getCssBuild: getPlainCssBuild,
						cssClasses,
						removeUnusedClasses,
						logLevel,
					}),
					extractSvelteCssClassesPluginInstance,
			  ]
			: []),

		// currently this uses the result of `svelteUnrolled`'s transform hook
		// in its own transform hook, so it needs to be placed after it in plugins
		// TODO is there good a way to warn/error if they're out of order?
		// TODO the order of these is pretty important right now,
		// but I think they can be made less order-dependent
		// once the rollup file emit API is ready -
		// https://github.com/rollup/rollup/issues/2938
		syPlugin({
			dev,
			cacheCss: cacheSyCss,
			cssClasses,
			removeUnusedClasses,
			prettierOptions,
			logLevel,
		}),

		...oldPlugins.slice(plainCssPluginIndex + 1),

		bundleWriterPlugin({
			srcPath: paths.source,
			externalsPath: paths.externals,
			output: paths.staticJsStats,
		}),
	];

	return {...inputOptions, plugins};
};
