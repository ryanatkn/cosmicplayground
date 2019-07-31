import * as ts from 'typescript';
import * as fp from 'path';

import {Logger} from '../logger';
import {hasExt} from '../scriptUtils';
import {toRootPath} from '../paths';
import {TsConfig, isSveltePath} from './tsHelpers';

export const typecheck = (
	tsconfig: TsConfig,
	rootFileName: string,
	rootCode: string,
	codeById: Map<string, string>,
	ignoredExts: string[],
	log: Logger,
): ReadonlyArray<ts.Diagnostic> => {
	log.info('typecheck', rootFileName);

	const compilerOptions: ts.CompilerOptions = {
		...tsconfig.compilerOptions,
		// TODO What does `allowNonTsExtensions` do?
		// Even setting it to `false` does nothing, despite the fact
		// that we're faking `.svelte` files as `.ts`.
		// According to TS team members in the Vue TS code, it's needed.
		// https://github.com/vuejs/vetur/pull/94/commits/980a918eb78d96488e0e8ec429ead31e8c386b37
		// allowNonTsExtensions: true,
	};

	const createProgramOptions: ts.CreateProgramOptions = {
		rootNames: [rootFileName], // ReadonlyArray<string>
		options: compilerOptions, // CompilerOptions
		// projectReferences:  [], // ? ReadonlyArray<ProjectReference>
		host: createCompilerHost(
			compilerOptions,
			rootFileName,
			rootCode,
			codeById,
			ignoredExts,
			log,
		), // ? CompilerHost
		// oldProgram:  , // ? Program
		// configFileParsingDiagnostics:  , // ? ReadonlyArray<Diagnostic>
	};
	const program = ts.createProgram(createProgramOptions);
	const preEmitDiagnostics = ts.getPreEmitDiagnostics(program); // gets syntactic/semantic/global diagnostics
	// TODO do we need to emit for the full set of error messages?
	// const emitResult = program.emit();

	const diagnostics = ts.sortAndDeduplicateDiagnostics([
		...preEmitDiagnostics,
		// TODO what do these include that aren't preEmitDiagnostics?
		// it'd be nice to not have to emit at all
		// ...emitResult.diagnostics,
	]);
	return diagnostics;
};

const createCompilerHost = (
	compilerOptions: ts.CompilerOptions,
	rootFileName: string,
	rootCode: string,
	codeById: Map<string, string>,
	ignoredExts: string[],
	log: Logger,
): ts.CompilerHost => {
	const {trace} = log;
	// I'm choosing not to defer to a base host's functions
	// in order to gain more visibility into the behavior and learn.
	// const baseHost = ts.createCompilerHost(compilerOptions);

	const fileExists = (fileName: string): boolean => {
		const exists =
			fileName === rootFileName || isSveltePath(fileName)
				? codeById.has(fileName)
				: ts.sys.fileExists(fileName);
		trace('fileExists', toRootPath(fileName), exists);
		return exists;
	};
	const readFile = (fileName: string): string | undefined => {
		trace('readFile', toRootPath(fileName));
		return fileName === rootFileName ? rootCode : ts.sys.readFile(fileName);
	};

	const host: ts.CompilerHost = {
		// ts.ModuleResolutionHost (base interface)
		// TODO cache files in memory - rollup?
		fileExists,
		readFile,
		// trace?(s: string): void {},
		// directoryExists?(directoryName: string): boolean {},
		// Resolve a symbolic link. @see https://nodejs.org/api/fs.html#fs_fs_realpathsync_path_options
		// realpath?(path: string): string {},
		// getCurrentDirectory?(): string {},
		// getDirectories?(path: string): string[] {},

		// ts.CompilerHost
		getSourceFile(
			fileName: string,
			languageVersion: ts.ScriptTarget,
			// onError?: (message: string) => void,
			// shouldCreateNewSourceFile?: boolean,
		): ts.SourceFile | undefined {
			if (!fileName.includes('/node_modules/typescript/lib/')) {
				// TODO there are a lot of typescript imports -
				// is typescript caching these during `ts.sys.readFile`?
				trace('getSourceFile', toRootPath(fileName));
			}
			// TODO cache?
			if (fileName === rootFileName) {
				return ts.createSourceFile(rootFileName, rootCode, languageVersion);
			}
			const sourceText = isSveltePath(fileName)
				? loadSvelteImport(fileName, codeById, log)
				: ts.sys.readFile(fileName);
			return sourceText === undefined
				? undefined
				: ts.createSourceFile(fileName, sourceText, languageVersion);
		},
		// getSourceFileByPath?(fileName: string, path: Path, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): SourceFile | undefined {},
		// getCancellationToken?(): CancellationToken {},
		getDefaultLibFileName(options: ts.CompilerOptions): string {
			return ts.getDefaultLibFilePath(options);
		},
		// getDefaultLibLocation?(): string {},
		writeFile(
			fileName: string,
			_data: string,
			_writeByteOrderMark: boolean,
			// onError?: (message: string) => void,
			// sourceFiles?: ReadonlyArray<ts.SourceFile>,
		): void {
			trace('writeFile', toRootPath(fileName));
			// no-op - should this be called?
			// throw Error(`'compilerHost.writeFile' is not implemented`);
		},
		getCurrentDirectory(): string {
			const dir = ts.sys.getCurrentDirectory();
			trace('getCurrentDirectory', dir);
			return dir;
		},
		getCanonicalFileName(fileName: string): string {
			return fileName;
			// TODO windows?
			// return ts.sys.useCaseSensitiveFileNames
			// 	? fileName
			// 	: fileName.toLowerCase();
		},
		useCaseSensitiveFileNames(): boolean {
			return true;
			// TODO windows?
			// return ts.sys.useCaseSensitiveFileNames;
		},
		getNewLine(): string {
			return '\n';
			// TODO windows?
			// return ts.sys.newLine;
		},
		// readDirectory?(rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): string[] {},
		resolveModuleNames(
			moduleNames: string[],
			containingFile: string,
			_reusedNames?: string[],
			_redirectedReference?: ts.ResolvedProjectReference,
		): (ts.ResolvedModule | undefined)[] {
			trace('containingFile', toRootPath(containingFile));
			const resolvedModules: (ts.ResolvedModule | undefined)[] = [];
			for (const moduleName of moduleNames) {
				if (hasExt(moduleName, ignoredExts)) {
					// skip extensions like `.css`
					resolvedModules.push(undefined);
					trace('ignoring moduleName', moduleName);
					continue;
				}
				trace('resolving moduleName', moduleName);
				const resolved: ts.ResolvedModuleFull | undefined = isSveltePath(
					moduleName,
				)
					? {
							resolvedFileName: fp.join(fp.dirname(containingFile), moduleName),
							// The TypeScript docs say `extension` must match the `resolvedFileName`,
							// but this is the strategy that Vue uses,
							// which was authored and reviewed by TS team members.
							// https://github.com/vuejs/vetur/pull/94/commits/980a918eb78d96488e0e8ec429ead31e8c386b37
							// An alternate way is to change `getSourceFile` and `fileExists`
							// to resolve `.svelte` files as `.svelte.ts`,
							// so we'll revert to that if this ever breaks.
							extension: ts.Extension.Ts, // TODO support JS too from script attr
					  }
					: ts.resolveModuleName(moduleName, containingFile, compilerOptions, {
							fileExists,
							readFile,
					  }).resolvedModule;
				if (!resolved) {
					throw Error(
						`Failed to resolve moduleName '${moduleName}'. ` +
							`You may need to include its file extension in 'ignoredExts'.`,
					);
				}
				resolvedModules.push(resolved);
			}

			return resolvedModules;
		},
		// This method is a companion for 'resolveModuleNames' and is used to resolve 'types' references to actual type declaration files
		// resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference?: ResolvedProjectReference): (ResolvedTypeReferenceDirective | undefined)[] {},
		// getEnvironmentVariable?(name: string): string | undefined {},
		// createHash?(data: string): string {},
		// getParsedCommandLine?(fileName: string): ParsedCommandLine | undefined {},
	};
	return host;
};

const loadSvelteImport = (
	path: string,
	codeById: Map<string, string>,
	{error}: Logger,
): string => {
	const code = codeById.get(path);
	if (!code)
		error(
			`Missing cached code at path '${path}'.` +
				` There's probably an improperly handled error upstream.`,
		);
	return code || '';
};
