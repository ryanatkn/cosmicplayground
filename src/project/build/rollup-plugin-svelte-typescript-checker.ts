import {Plugin} from 'rollup';
import {blue, gray} from 'kleur';
import * as fp from 'path';
import {outputFile, emptyDirSync} from 'fs-extra';
import {RawSourceMap} from 'source-map';

import {SvelteUnrolledCompilation} from './rollup-plugin-svelte-unrolled';
import {LogLevel, logger, fmtVal, fmtMs} from '../logger';
import {timeTracker} from '../scriptUtils';
import {toRootPath} from '../paths';
import {generateVirtualSvelteTs} from './virtualSvelteTs';
import {loadTsconfig, logTsDiagnostics} from './tsHelpers';
import {typecheck} from './typecheck';
import {mapVirtualDiagnosticsToSource} from './tsDiagnostics';
import {omitUndefined} from '../../utils/obj';

/*

The strategy this uses is to combine the original TypeScript and the markup AST
to build a virtual program just for typechecking purposes.
The resulting code looks nothing like Svelte's output and is not emitted.
This is obviously not ideal for many reasons -
compared to a solution that integrates with Svelte itself,
this is more complex and it duplicates a lot of things Svelte does,
so it will break when Svelte changes and it's necessarily slower.

TODO next steps

- fixes
  - style checks should be warnings - research reportStyleChecksAsWarnings
  - import utils/obj breaks with missing global d.ts
	- import easings breaks with svelte imports - can we elide importing and just do typechecking of node_modules?
- improvements
	- see note below about non-specific prop errors
	- source map secondary diagnostics like "Did you mean 'foo'?" ... "'foo' is declared here." (at unmapped location)
- incremental typechecking

- things to learn more about
  - language server
    - https://microsoft.github.io/language-server-protocol/overview
    - https://github.com/UnwrittenFun/svelte-language-server
  - typescript compiler
    - https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
  - svelte internals

TODO non-specific prop errors

The diagnostics for prop type errors don't point to individual props.
Vscode somehow does this, but TypeScript's CLI and the API we're using
only points to the `props` object on our component constructors,
instead of to the specific property with the error. Example:

		error TS2322: Type '{ a: string; childOneNum: string; childOneStr: string; childOneStrTwo: string; }' is not assignable to type 'Props'.
			Types of property 'childOneNum' are incompatible.
				Type 'string' is not assignable to type 'number | undefined'.

		6 <AppTESTChild1 {a} childOneNum={'1'} childOneStr="y" childOneStrTwo=y />
			~~~~~~~~~~~~~~

This is the current band-aid state where `props`
are mapped back to the component tag.
Ideally though, `childOneNum`'s value the above example would be underlined.

How does vscode display the diagnostics correctly?
Maybe there's a TypeScript helper that works with the `Diagnostic` type
to convert it to the usable form? I looked briefly but didn't see anything.

Is there a different source code form that we could generate to
make the diagnostics mappable by default?

*/

export interface PluginOptions {
	rootFileNames: readonly string[];
	getSvelteCompilation: (id: string) => SvelteUnrolledCompilation | undefined;
	// TODO consider structuring the `preprocessedCodeCode`
	// to be part of the svelte compilation
	// preprocessed: {markup: '...', script: {module: '...', instance: '...'}, style: '...'}
	tsconfigPath: string | undefined;
	ignoredExts: string[]; // extensions that TypeScript shouldn't try to import
	debugVirtualSvelteTsOutputDir: string | undefined;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'rootFileNames' | 'getSvelteCompilation';
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = (
	initialOptions: InitialPluginOptions,
): PluginOptions => ({
	tsconfigPath: undefined,
	ignoredExts: ['.css'],
	debugVirtualSvelteTsOutputDir: undefined,
	logLevel: LogLevel.Info,
	...omitUndefined(initialOptions),
	rootFileNames: initialOptions.rootFileNames.filter(Boolean),
});

export const name = 'svelte-typescript-checker';

export const svelteTypescriptCheckerPlugin = (
	pluginOptions: InitialPluginOptions,
): Plugin => {
	const {
		rootFileNames,
		getSvelteCompilation,
		tsconfigPath,
		ignoredExts,
		debugVirtualSvelteTsOutputDir,
		logLevel,
	} = defaultPluginOptions(pluginOptions);

	const log = logger(logLevel, [blue(`[${name}]`)]);
	const {info} = log;

	if (!rootFileNames.length) throw Error(`'rootFileNames' is empty`);

	// if a debug out dir is set, make sure it's empty before building
	if (debugVirtualSvelteTsOutputDir) {
		emptyDirSync(debugVirtualSvelteTsOutputDir);
	}

	const tsconfig = loadTsconfig(tsconfigPath, log);

	const rootCodeById = new Map<string, string>();
	const virtualSvelteTsCodeById = new Map<string, string>();
	const virtualSvelteTsSourceMapById = new Map<string, RawSourceMap>();

	return {
		name,
		// TODO probably run this in a worker so it doesn't affect the main build thread
		async transform(code, id) {
			// Ideally this line belongs in a hypothetical
			// `afterLoad` or `beforeTransform` hook,
			// because doing it here means this plugin must be
			// included before the typescript plugin.
			// It wouldn't be needed at all if we had a way to get
			// the original source for an id during `buildEnd`
			// from the rollup plugin context, but I don't see a way to do that.
			if (rootFileNames.includes(id)) rootCodeById.set(id, code);

			const compilation = getSvelteCompilation(id);
			if (!compilation) return null;

			// add js expressions from the svelte markup and
			// build a virtual typescript program purely for typechecking purposes
			const elapsed = timeTracker();

			const virtualSvelteTs = generateVirtualSvelteTs(
				id,
				compilation.originalCode,
				compilation.code,
				compilation.ast.html,
				compilation.vars,
				log,
			);

			// cache the virtual code and its MagicString
			virtualSvelteTsCodeById.set(id, virtualSvelteTs.code);
			virtualSvelteTsSourceMapById.set(id, virtualSvelteTs.map);

			// if a debug out dir is set, write out the virtual ts code
			if (debugVirtualSvelteTsOutputDir) {
				outputFile(
					fp.join(debugVirtualSvelteTsOutputDir, fp.basename(id) + '.ts'),
					virtualSvelteTs.code,
				);
			}

			info(
				gray(toRootPath(id)),
				fmtVal('typescript_checker_transform', fmtMs(elapsed(), 2)),
			); // TODO track with stats instead of logging

			return null;
		},
		buildEnd() {
			// for now this isn't awaiting results because
			// we don't want to hold anything up for typechecking
			// TODO typechecking should probably be performed in a worker

			info('typechecking');

			// TODO change to use incremental builder/watcher
			for (const rootFileName of rootFileNames) {
				const elapsed = timeTracker();
				const rootCode = rootCodeById.get(rootFileName);
				if (rootCode === undefined) {
					throw Error(`Missing rootCode with rootFileName '${rootFileName}'`);
				}
				const virtualDiagnostics = typecheck(
					tsconfig,
					rootFileName,
					rootCode,
					virtualSvelteTsCodeById,
					ignoredExts,
					log,
				);
				// note that this doesn't `await` - see comments at top of `buildEnd`
				mapVirtualDiagnosticsToSource(
					virtualDiagnostics,
					virtualSvelteTsSourceMapById,
				).then(sourceDiagnostics => {
					logTsDiagnostics(sourceDiagnostics, log);
					info(
						gray(toRootPath(rootFileName)),
						fmtVal('typescript_checker', fmtMs(elapsed(), 2)),
					); // TODO track with stats instead of logging
				});
			}
		},
	};
};
