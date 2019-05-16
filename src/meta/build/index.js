import dotenv from 'dotenv';
dotenv.config();
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const {NODE_ENV} = process.env;
const dev = NODE_ENV !== 'production';

import rollup from 'rollup';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import terser from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript';
import ck from 'chalk';
import fs from 'fs-extra';

import paths from '../paths.js';
import {argv, verboseLog, handleTaskError, rainbow} from '../scriptUtils.js';

const watch = argv['watch'];

const runBuild = async () => {
  // clean up and prepare build directory
  verboseLog(ck.magenta('cleaning up and preparing build dir'));
  fs.ensureDirSync(paths.appBuildDist);
  fs.emptyDirSync(paths.appBuildDist);

  // copy over static files
  verboseLog(ck.magenta('copying static files'));
  await fs.copy(paths.appStatic, paths.appBuildDistClient, {dereference: true});

  // run rollup
  if (watch) {
    verboseLog(ck.magenta('building and watching'));
    await runRollupWatcher();
    verboseLog(ck.magenta('stopped watching'));
  } else {
    verboseLog(ck.magenta('building'));
    await runRollupBuild();
    verboseLog(ck.magenta('completed build'));
  }
};

const runRollupWatcher = async () => {
  return new Promise((resolve, reject) => {
    const watchOptions = createWatchOptions();
    console.log('watchOptions', watchOptions);
    const watcher = rollup.watch(watchOptions);

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

const runRollupBuild = async () => {
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

  await build.write(outputOptions);

  return {build, output};
};

const createWatchOptions = () => {
  const watchOptions = {
    ...createInputOptions(),
    output: createOutputOptions(),
    watch: {
      // chokidar,
      clearScreen: false,
      exclude: 'node_modules/**',
      // include,
    },
  };
  return watchOptions;
};

const createInputOptions = () => {
  const inputOptions = {
    // — core input options
    // external,
    input: 'src/main.ts', // required
    plugins: [
      typescript(),
      svelte({
        include: 'src/components/**/*.svelte',
        dev: !dev,
        css: css => {
          css.write('static/bundle.css', !dev);
        },
      }),
      resolve(),
      commonjs(),
      ...(dev
        ? [serve({contentBase: 'static', port: 3000, host: '0.0.0.0'})]
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

const createOutputOptions = () => {
  const outputOptions = {
    // — core output options
    // dir,
    file: 'static/bundle.js',
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
  .catch(handleTaskError);
