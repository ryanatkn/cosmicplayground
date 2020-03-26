import * as ts from 'typescript';
import {RawSourceMap, SourceMapConsumer} from 'source-map';

import {toRootPath} from '../paths';
import {isSveltePath} from './tsHelpers';

/*

Source maps for TypeScript errors and other diagnostics

At a high level, we need source mappings
from the virtual Svelte TypeScript code
back to the original `.svelte` code.
We use the source maps returned from `./virtualSvelteTs.ts`
to map positions in the TypeScript diagnostics
of the virtual code back to the original Svelte code.

*/

// Maps TypeScript diagnostics (error messages) from the generated virtual ts
// back to the original unpreprocessed source.
export const mapVirtualDiagnosticsToSource = async (
	virtualDiagnostics: ReadonlyArray<ts.Diagnostic>,
	virtualSvelteTsSourceMapById: Map<string, RawSourceMap>,
): Promise<ReadonlyArray<ts.Diagnostic>> => {
	// We need to translate the virtual `ts.SourceFile` to a source version that's
	// just complete enough to be used by the ts diagnostic formatter.
	const sourceFileById: Map<string, ts.SourceFileLike> = new Map(
		Array.from(virtualSvelteTsSourceMapById, ([id, sourceMap]) => {
			const text = getSourceContent(sourceMap, id);
			return [
				id,
				{
					text,
					end: text.length,
					// `lineMap` gets populated by calls to `ts.getLineAndCharacterOfPosition`
					lineMap: undefined,
					// TypeScript's internal `ts.SourceFileLike` interface is
					// different from the external one, but it's the internal
					// one that's important for the API behavior we're relying on.
					// In `tsc.js#getLineAndCharacterOfPosition` it's currently
					// ok but not longterm safe to assert this as not null with `!`,
					// because the API internals may change in the future.
					getLineAndCharacterOfPosition: undefined!,
				},
			];
		}),
	);

	const sourceDiagnostics = await Promise.all(
		virtualDiagnostics.map(async diagnostic => {
			const virtualFile = diagnostic.file;
			const virtualStart = diagnostic.start;
			const virtualLength = diagnostic.length;
			if (
				virtualFile === undefined ||
				virtualStart === undefined ||
				virtualLength === undefined
			) {
				return diagnostic;
			}
			const {fileName} = virtualFile;

			// Unfortunately TypeScript diagnostics have start/length positions,
			// and the `source-map` library uses line/column,
			// so the code ends up converting both ways.
			// There's far more complexity because of this,
			// but luckily we can use two TypeScript functions
			// to do most of the heavy lifting for us,
			// `ts.getLineAndCharacterOfPosition` and
			// `ts.getPositionOfLineAndCharacter`.

			const sourceMap = virtualSvelteTsSourceMapById.get(fileName);
			if (!sourceMap) {
				if (isSveltePath(fileName)) {
					throw Error(`Expected source map for ${toRootPath(fileName)}`);
				} else {
					return diagnostic; // pass through all non-Svelte diagnostics
				}
			}

			const sourceDiagnostic: ts.Diagnostic = await SourceMapConsumer.with(
				sourceMap,
				null,
				consumer => {
					const virtualStartLineAndChar = ts.getLineAndCharacterOfPosition(
						virtualFile,
						virtualStart,
					);
					const virtualEndLineAndChar = ts.getLineAndCharacterOfPosition(
						virtualFile,
						virtualStart + virtualLength - 1,
					);

					const sourceStartPos = consumer.originalPositionFor({
						line: virtualStartLineAndChar.line + 1, // TS lines are zero-based
						column: virtualStartLineAndChar.character,
					});
					const sourceEndPos = consumer.originalPositionFor({
						line: virtualEndLineAndChar.line + 1, // TS lines are zero-based
						column: virtualEndLineAndChar.character,
					});
					if (
						sourceStartPos.line === null ||
						sourceStartPos.column === null ||
						sourceEndPos.line === null ||
						sourceEndPos.column === null
					) {
						// this occurs when there's a syntax error,
						// so just pass through the original diagnotic
						return diagnostic;
					}

					// map the diagnostic's line/column back to the source
					const sourceFile = sourceFileById.get(fileName);
					if (!sourceFile) {
						throw Error(`Expected to find source file for ${fileName}`);
					}
					const sourceStartIndex = ts.getPositionOfLineAndCharacter(
						sourceFile,
						sourceStartPos.line - 1, // TS lines are zero-based
						sourceStartPos.column,
					);
					const sourceEndIndex = ts.getPositionOfLineAndCharacter(
						sourceFile,
						sourceEndPos.line - 1, // TS lines are zero-based
						sourceEndPos.column,
					);

					return {
						...diagnostic,
						start: sourceStartIndex,
						length: sourceEndIndex - sourceStartIndex,
						file: {
							// We need to provide a `ts.SourceFile` that's
							// just complete enough to be used by the diagnostic formatter.
							...virtualFile,
							...sourceFile,
						},
					};
				},
			);
			return sourceDiagnostic;
		}),
	);

	return sourceDiagnostics;
};

const getSourceContent = (
	sourceMap: RawSourceMap,
	fileName: string,
): string => {
	const sourceIndex = sourceMap.sources.indexOf(fileName);
	if (sourceIndex === -1) {
		throw Error(`Expected to find source map content for ${fileName}`);
	}
	if (!sourceMap.sourcesContent) {
		throw Error(`Expected to find sourcesContent on map for ${fileName}`);
	}
	return sourceMap.sourcesContent[sourceIndex];
};
