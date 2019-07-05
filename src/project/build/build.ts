import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const {NODE_ENV, PORT, HOST} = process.env;
const dev = NODE_ENV !== 'production';
const host = HOST || '0.0.0.0';
const port = PORT || '8999';

import * as rollup from 'rollup';
import {
	OutputOptions,
	InputOptions,
	RollupWatchOptions,
	RollupOutput,
	RollupBuild,
} from 'rollup';
import * as resolvePluginFIXME from 'rollup-plugin-node-resolve';
import * as commonjsPluginFIXME from 'rollup-plugin-commonjs';
import * as terserPlugin from 'rollup-plugin-terser';
import * as servePlugin from 'rollup-plugin-serve';
import * as typescriptPlugin from 'rollup-plugin-typescript';
import {magenta} from 'kleur';
import * as fs from 'fs-extra';
import * as prettier from 'prettier';

import {paths} from '../paths';
import {argv, handleScriptError, rainbow, resolvePath} from '../scriptUtils';
import {logger, LogLevel} from '../logger';
import {clean} from './clean';
import {outputCssPlugin} from './rollup-plugin-output-css';
import {syPlugin} from './rollup-plugin-sy';
import {svelteUnrolledPlugin} from './rollup-plugin-svelte-unrolled';
import {extractPlainCssClassesPlugin} from './rollup-plugin-extract-plain-css-classes';
import {extractSvelteCssClassesPlugin} from './rollup-plugin-extract-svelte-css-classes';
import {diagnosticsPlugin} from './rollup-plugin-diagnostics';
import {bundleWriterPlugin} from './rollup-plugin-bundle-writer';
import {createCssClassesCache} from './cssClassesCache';

const pkg = require('../../../package.json'); // TODO import differently?
const prettierOptions: prettier.Options = pkg.prettier;

const {watch} = argv;

const logLevel = LogLevel.Info; // TODO pull from argv?
const {info} = logger(logLevel, [magenta('[build]')]);

// TODO These modules require `esModuleInterop` to work correctly.
// Rather than doing that and forcing `allowSyntheticDefaultImports`,
// I'm opting to just fix the module types after importing for now.
// This can probably be sorted out cleanly when `ts-node` supports ES modules.
const resolvePlugin: typeof resolvePluginFIXME.default = resolvePluginFIXME as any;
const commonjsPlugin: typeof commonjsPluginFIXME.default = commonjsPluginFIXME as any;

const removeUnusedClasses = !dev;
const warnUndefinedClasses = true;

const cssClasses = createCssClassesCache({logLevel});

// TODO consider using two separate css plugins
// it's hard to tell if we'll ever want a single one to be able to coordinate multiple bundles
const outputCssPluginInstance = outputCssPlugin({
	sourcemap: dev,
	cssClasses,
	logLevel,
});
const cacheSvelteCss = outputCssPluginInstance.cacheCss.bind(
	null,
	paths.svelteCssBundleName,
);
const cacheSyCss = outputCssPluginInstance.cacheCss.bind(
	null,
	paths.syCssBundleName,
);
const cachePlainCss = outputCssPluginInstance.cacheCss.bind(
	null,
	paths.plainCssBundleName,
);
const svelteUnrolledPluginInstance = svelteUnrolledPlugin({
	dev,
	cacheCss: cacheSvelteCss,
	include: resolvePath('src/client/**/*.svelte'),
	logLevel,
});
const extractSvelteCssClassesPluginInstance =
	removeUnusedClasses || warnUndefinedClasses
		? extractSvelteCssClassesPlugin({
				cssClasses,
				getSvelteCompilation: svelteUnrolledPluginInstance.getCompilation,
				logLevel,
		  })
		: undefined;

// TODO all of the above `PluginInstance` stuff is tiresome.
// consider changing plugins to be `createFooPlugin`

const createInputOptions = (): InputOptions => {
	const inputOptions: InputOptions = {
		// — core input options
		// external,
		input: 'src/client/main.ts', // required
		plugins: [
			// TODO a lot of these plugins have deps that need to be refactored
			// the rollup `emitFile` API should be helpful when it lands
			// https://github.com/rollup/rollup/issues/2938
			diagnosticsPlugin({
				logLevel,
			}),
			typescriptPlugin(),
			svelteUnrolledPluginInstance,
			// TODO this dependency on a similarly named peer is an obvious problem -
			// file emitting will probably fix
			extractSvelteCssClassesPluginInstance
				? extractPlainCssClassesPlugin({
						cacheCss: cachePlainCss,
						cssClasses,
						removeUnusedClasses,
						logLevel,
				  })
				: undefined,
			extractSvelteCssClassesPluginInstance,
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
			outputCssPluginInstance,
			resolvePlugin(),
			commonjsPlugin(),
			...(dev
				? [watch && servePlugin({contentBase: paths.appStatic, host, port})]
				: [terserPlugin.terser()]),
			bundleWriterPlugin({
				srcPath: paths.appSrc,
				externalsPath: paths.appExternals,
				output: paths.appStaticJsStats,
			}),
		],

		// — advanced input options
		// cache,
		// inlineDynamicImports,
		// manualChunks,
		// onwarn,
		// preserveModules,

		// — danger zone
		// acorn,
		// acornInjectPlugins,
		// context,
		// moduleContext,
		// preserveSymlinks,
		// shimMissingExports,
		// treeshake,

		// — experimental
		// chunkGroupingSize,
		// experimentalCacheExpiry,
		// experimentalOptimizeChunks,
		// experimentalTopLevelAwait,
		// perf
	};
	return inputOptions;
};

const createOutputOptions = (): OutputOptions => {
	const outputOptions: OutputOptions = {
		// — core output options
		// dir: paths.appStatic, // TODO chunks - also, output to `/build` instead of static?
		file: paths.appStaticJs,
		format: 'iife', // required
		// globals,
		name: 'app',

		// — advanced output options
		// assetFileNames,
		// banner,
		// chunkFileNames,
		// compact,
		// entryFileNames,
		// extend,
		// footer,
		// interop,
		// intro,
		// outro,
		// paths,
		sourcemap: true,
		// sourcemapExcludeSources,
		// sourcemapFile,
		// sourcemapPathTransform,

		// — danger zone
		// amd,
		// dynamicImportFunction,
		// esModule,
		// exports,
		// freeze,
		// indent,
		// namespaceToStringTag,
		// noConflict,
		// preferConst,
		// strict
	};
	return outputOptions;
};

const createWatchOptions = (): RollupWatchOptions => {
	const watchOptions: RollupWatchOptions = {
		...createInputOptions(),
		output: createOutputOptions(),
		watch: {
			// chokidar,
			clearScreen: false,
			exclude: ['node_modules/**'],
			// include,
		},
	};
	return watchOptions;
};

const runBuild = async (): Promise<void> => {
	info(`building ... NODE_ENV=${NODE_ENV}`);

	await clean();

	// run rollup
	if (watch) {
		// TODO we currently have things a bit wonky between /build and /static - need to figure out how we want things to work (it can be nice to get prod builds in /build for dev purposes)
		// copy over static files
		info('copying static files');
		await fs.copy(paths.appStatic, paths.appBuildDistClient, {
			dereference: true,
		});

		// run the watcher
		info('building and watching');
		await runRollupWatcher();
		info('stopped watching');
	} else {
		// build the js
		info('building');
		await runRollupBuild();
		info('completed build');

		// copy over static files
		info('copying static files');
		await fs.copy(paths.appStatic, paths.appBuildDistClient, {
			dereference: true,
		});
	}
};

const runRollupBuild = async (): Promise<{
	build: RollupBuild;
	output: RollupOutput;
}> => {
	const inputOptions = createInputOptions();
	const outputOptions = createOutputOptions();

	const build = await rollup.rollup(inputOptions);

	const output = await build.generate(outputOptions);

	// for (const chunkOrAsset of output.output) {
	//   if (chunkOrAsset.isAsset) {
	//     // For assets, this contains
	//     // {
	//     //   isAsset: true,                 // signifies that this is an asset
	//     //   fileName: string,              // the asset file name
	//     //   source: string | Buffer        // the asset source
	//     // }
	//     console.log('Asset', chunkOrAsset);
	//   } else {
	//     // For chunks, this contains
	//     // {
	//     //   code: string,                  // the generated JS code
	//     //   dynamicImports: string[],      // external modules imported dynamically by the chunk
	//     //   exports: string[],             // exported variable names
	//     //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
	//     //   fileName: string,              // the chunk file name
	//     //   imports: string[],             // external modules imported statically by the chunk
	//     //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
	//     //   isEntry: boolean,              // is this chunk a static entry point
	//     //   map: string | null,            // sourcemaps if present
	//     //   modules: {                     // information about the modules in this chunk
	//     //     [id: string]: {
	//     //       renderedExports: string[]; // exported variable names that were included
	//     //       removedExports: string[];  // exported variable names that were removed
	//     //       renderedLength: number;    // the length of the remaining code in this module
	//     //       originalLength: number;    // the original length of the code in this module
	//     //     };
	//     //   },
	//     //   name: string                   // the name of this chunk as used in naming patterns
	//     // }
	//     console.log('Chunk', chunkOrAsset.modules);
	//   }
	// }

	await build.write(outputOptions); // don't care about the output of this - maybe refactor

	return {build, output};
};

const runRollupWatcher = async (): Promise<void> => {
	return new Promise((_resolve, reject) => {
		const watchOptions = createWatchOptions();
		// info(('watchOptions'), watchOptions);
		const watcher = rollup.watch([watchOptions]);

		watcher.on('event', event => {
			info(`rollup event: ${event.code}`);
			switch (event.code) {
				case 'START': // the watcher is (re)starting
				case 'BUNDLE_START': // building an individual bundle
				case 'BUNDLE_END': // finished building a bundle
				case 'END': // finished building all bundles
					break;
				case 'ERROR': // encountered an error while bundling
					console.log('error', event);
					reject(`Error: ${event.message}`);
					break;
				case 'FATAL': // encountered an unrecoverable error
					console.log('fatal', event);
					reject(`Fatal error: ${event.message}`);
					break;
				default:
					throw Error(`Unknown rollup watch event code: ${event.code}`);
			}
		});

		// call this ever?
		// watcher.close();
	});
};

runBuild()
	.then(() => {
		console.log(
			[
				rainbow('~~~~~~~~~~~~~'),
				rainbow('~❤~ built ~❤~'),
				rainbow('~~~~~~~~~~~~~'),
			].join('\n'),
		);
	})
	.catch(handleScriptError);
