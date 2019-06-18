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
import {
	argv,
	verboseLog,
	handleScriptError,
	rainbow,
	resolvePath,
} from '../scriptUtils';
import {clean} from './clean';
import {plainCssPlugin} from './rollup-plugin-plain-css';
import {syPlugin} from './rollup-plugin-sy';
import {svelteUnrolledPlugin} from './rollup-plugin-svelte-unrolled';
import {svelteExtractCssClassesPlugin} from './rollup-plugin-svelte-extract-css-classes';
import {diagnosticsPlugin} from './rollup-plugin-diagnostics';

const pkg = require('../../../package.json'); // TODO import differently?
const prettierOptions: prettier.Options = pkg.prettier;

const {watch} = argv;

// TODO These modules require `esModuleInterop` to work correctly.
// Rather than doing that and forcing `allowSyntheticDefaultImports`,
// I'm opting to just fix the module types after importing for now.
// This can probably be sorted out cleanly when `ts-node` supports ES modules.
const resolvePlugin: typeof resolvePluginFIXME.default = resolvePluginFIXME as any;
const commonjsPlugin: typeof commonjsPluginFIXME.default = commonjsPluginFIXME as any;

const removeUnusedClasses = !dev;

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
				verbose: true,
			}),
			typescriptPlugin(),
			svelteUnrolledPlugin({
				include: resolvePath('src/client/**/*.svelte'),
				dev,
				verbose: true,
			}),
			// currently this uses the result of `svelteUnrolled`'s transform hook
			// in its own transform hook, so it needs to be placed after it in plugins
			// TODO is there good a way to warn/error if they're out of order?
			removeUnusedClasses &&
				svelteExtractCssClassesPlugin({
					verbose: true,
				}),
			// TODO the order of these is pretty important right now,
			// but I think they can be made less order-dependent
			// once the rollup file emit API is ready -
			// https://github.com/rollup/rollup/issues/2938
			syPlugin({
				dev,
				verbose: true,
				prettierOptions,
				removeUnusedClasses,
			}),
			plainCssPlugin({
				sourcemap: dev,
				verbose: true,
			}),
			resolvePlugin(),
			commonjsPlugin(),
			...(dev
				? [
						watch &&
							servePlugin({contentBase: resolvePath('static'), host, port}),
				  ]
				: [terserPlugin.terser()]),
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
	verboseLog(magenta(`building ... NODE_ENV=${NODE_ENV}`));

	await clean();

	// run rollup
	if (watch) {
		// TODO we currently have things a bit wonky between /build and /static - need to figure out how we want things to work (it can be nice to get prod builds in /build for dev purposes)
		// copy over static files
		verboseLog(magenta('copying static files'));
		await fs.copy(paths.appStatic, paths.appBuildDistClient, {
			dereference: true,
		});

		// run the watcher
		verboseLog(magenta('building and watching'));
		await runRollupWatcher();
		verboseLog(magenta('stopped watching'));
	} else {
		// build the js
		verboseLog(magenta('building'));
		await runRollupBuild();
		verboseLog(magenta('completed build'));

		// copy over static files
		verboseLog(magenta('copying static files'));
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
		// verboseLog(magenta('watchOptions'), watchOptions);
		const watcher = rollup.watch([watchOptions]);

		watcher.on('event', event => {
			verboseLog(magenta(`rollup event: ${event.code}`));
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
				rainbow('—————————————'),
				rainbow('——! built !——'),
				rainbow('—————————————'),
			].join('\n'),
		);
	})
	.catch(handleScriptError);
