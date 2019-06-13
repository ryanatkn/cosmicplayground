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
import * as svelte from 'rollup-plugin-svelte';
import * as resolveFIXME from 'rollup-plugin-node-resolve';
import * as commonjsFIXME from 'rollup-plugin-commonjs';
import * as terser from 'rollup-plugin-terser';
import * as serve from 'rollup-plugin-serve';
import * as typescript from 'rollup-plugin-typescript';
import ck from 'chalk';
import * as fs from 'fs-extra';

import {paths} from '../paths';
import {
	argv,
	verboseLog,
	handleScriptError,
	rainbow,
	resolvePath,
} from '../scriptUtils';
import {clean} from './clean';
import {plainCss} from './rollup-plugin-plain-css';
import {sy} from './rollup-plugin-sy';

const watch = argv['watch'];

// TODO These modules require `esModuleInterop` to work correctly.
// Rather than doing that and forcing `allowSyntheticDefaultImports`,
// I'm opting to just fix the module types after importing for now.
// This can probably be sorted out cleanly when `ts-node` supports ES modules.
const resolve: typeof resolveFIXME.default = resolveFIXME as any;
const commonjs: typeof commonjsFIXME.default = commonjsFIXME as any;

const runBuild = async (): Promise<void> => {
	verboseLog(ck.magenta(`building ... NODE_ENV=${NODE_ENV}`));

	await clean();

	// run rollup
	if (watch) {
		// TODO we currently have things a bit wonky between /build and /static - need to figure out how we want things to work (it can be nice to get prod builds in /build for dev purposes)
		// copy over static files
		verboseLog(ck.magenta('copying static files'));
		await fs.copy(paths.appStatic, paths.appBuildDistClient, {
			dereference: true,
		});

		// run the watcher
		verboseLog(ck.magenta('building and watching'));
		await runRollupWatcher();
		verboseLog(ck.magenta('stopped watching'));
	} else {
		// build the js
		verboseLog(ck.magenta('building'));
		await runRollupBuild();
		verboseLog(ck.magenta('completed build'));

		// copy over static files
		verboseLog(ck.magenta('copying static files'));
		await fs.copy(paths.appStatic, paths.appBuildDistClient, {
			dereference: true,
		});
	}
};

const runRollupWatcher = async (): Promise<void> => {
	return new Promise((_resolve, reject) => {
		const watchOptions = createWatchOptions();
		verboseLog(ck.magenta('watchOptions'), watchOptions);
		const watcher = rollup.watch([watchOptions]);

		watcher.on('event', event => {
			verboseLog(ck.magenta(`rollup event: ${event.code}`));
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

const createInputOptions = (): InputOptions => {
	const inputOptions: InputOptions = {
		// — core input options
		// external,
		input: 'src/client/main.ts', // required
		plugins: [
			sy({
				dev,
				verbose: true,
			}),
			plainCss({
				output: resolvePath('static/bundle.css'),
				verbose: false,
			}),
			typescript(),
			svelte({
				include: resolvePath('src/client/**/*.svelte'),
				// TODO don't generate source maps in prod! maybe patch `rollup-plugin-svelte`?
				emitCss: true,
				// css: css => {
				// 	css.write('static/bundle.css', !dev);
				// },
			}),
			resolve(),
			commonjs(),
			...(dev
				? [watch && serve({contentBase: resolvePath('static'), host, port})]
				: [terser.terser()]),
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
		// dir,
		file: resolvePath('static/bundle.js'),
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
