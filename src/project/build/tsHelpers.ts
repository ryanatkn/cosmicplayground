import * as ts from 'typescript';
import {black, bgRed} from 'kleur';
import * as fp from 'path';

import {Logger} from '../logger';

// confusingly, there doesn't seem to be a good type for this
export interface TsConfig {
	// these compiler options have been
	// run through `ts.convertCompilerOptionsFromJson`
	compilerOptions?: ts.CompilerOptions;
	// these are the raw json compiler options
	compilerOptionsJson?: object;
	include?: string[];
	exclude?: string[];
	files?: string[];
	extends?: string;
	references?: {path: string}[];
	compileOnSave?: boolean;
}

export const loadTsconfig = (
	tsconfigPath: string | undefined,
	log: Logger,
): TsConfig => {
	// TODO consider passing a base path instead of using `process.cwd()`
	const basePath = tsconfigPath ? fp.dirname(tsconfigPath) : process.cwd();
	if (!tsconfigPath) {
		const searchPath = tsconfigPath || basePath;
		tsconfigPath = ts.findConfigFile(searchPath, ts.sys.fileExists);
		if (!tsconfigPath) {
			throw Error(`Could not locate tsconfig at ${searchPath}`);
		}
	}

	const readResult = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
	if (readResult.error) logTsDiagnostics([readResult.error], log);

	const config: TsConfig = readResult.config;
	if (!config) throw Error(`Unable to read tsconfig from ${tsconfigPath}`);

	const compilerOptionsJson = config.compilerOptions;
	const convertResult = ts.convertCompilerOptionsFromJson(
		compilerOptionsJson,
		basePath,
	);
	if (convertResult.errors) logTsDiagnostics(convertResult.errors, log);

	return {
		...config,
		compilerOptions: convertResult.options,
		compilerOptionsJson,
	};
};

export const logTsDiagnostics = (
	diagnostics: ReadonlyArray<ts.Diagnostic>,
	{error}: Logger,
): void => {
	const count = diagnostics.length;
	if (!count) return;
	const msg = ts.formatDiagnosticsWithColorAndContext(
		diagnostics,
		createFormatDiagnosticsHost(),
	);
	error(black(bgRed(` ${count} item${count === 1 ? '' : 's'}`)) + '\n' + msg);
};

const createFormatDiagnosticsHost = (): ts.FormatDiagnosticsHost => {
	return {
		getCurrentDirectory(): string {
			return ts.sys.getCurrentDirectory(); // TODO?
		},
		getCanonicalFileName(fileName: string): string {
			return fileName;
			// TODO windows?
			// return ts.sys.useCaseSensitiveFileNames
			// 	? fileName
			// 	: fileName.toLowerCase();
		},
		getNewLine(): string {
			return ts.sys.newLine;
		},
	};
};

// TODO where does this belong?
// TODO support other extensions like `.html`?
export const isSveltePath = (path: string): boolean =>
	fp.extname(path) === '.svelte';
