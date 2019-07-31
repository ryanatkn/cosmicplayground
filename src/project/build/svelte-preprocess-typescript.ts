import {PreprocessorGroup} from 'svelte/types/compiler/preprocess/index';
import {magenta} from 'kleur';
import * as ts from 'typescript';

import {omitUndefined} from '../../utils/obj';
import {LogLevel, logger} from '../logger';
import {loadTsconfig} from './tsHelpers';

export interface PluginOptions {
	langs: string[];
	tsconfigPath: string | undefined;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = (
	initialOptions: InitialPluginOptions,
): PluginOptions => ({
	langs: ['ts'],
	tsconfigPath: undefined,
	logLevel: LogLevel.Info,
	...omitUndefined(initialOptions),
});

const name = 'svelte-preprocess-typescript';

export const sveltePreprocessTypescript = (
	pluginOptions: InitialPluginOptions = {},
): PreprocessorGroup => {
	const {langs, tsconfigPath, logLevel} = defaultPluginOptions(pluginOptions);

	const log = logger(logLevel, [magenta(`[${name}]`)]);
	const {info} = log;

	const tsconfig = loadTsconfig(tsconfigPath, log);

	return {
		script({content, attributes, filename}) {
			if (!langs.includes(attributes.lang as any)) return null as any; // type is wrong
			info('script filename', filename);
			info('script attributes', attributes);
			const transpileOptions: ts.TranspileOptions = {
				compilerOptions: tsconfig.compilerOptions,
				fileName: filename,
				// reportDiagnostics?: boolean;
				// moduleName?: string;
				// renamedDependencies?: MapLike<string>;
				transformers: customTransformersForTranspile(),
			};
			const {outputText /* diagnostics, sourceMapText */} = ts.transpileModule(
				content,
				transpileOptions,
			);
			// console.log('outputText', outputText);
			const code = outputText;
			// console.log(magenta('\ncode\n\n'), code, '\n');
			return {code}; // TODO source map - needs Svelte support?
		},
	};
};

// these have the suffix `ForTranspile`
// because typechecking is performed as a separate step,
// because to make markup work correctly with typescript,
// we need to extract the code and construct a virtual.
// Ideally this isn't done separately,
// but Svelte has no compiler plugin functionality and doesn't plan on adding it.
// It's likely that ideal TypeScript support in Svelte could
// make the virtual typechecking program method obsolete.
const customTransformersForTranspile = (): ts.CustomTransformers => ({
	before: [importTransformerForTranspile()],
});

const importTransformerForTranspile: () => ts.TransformerFactory<
	ts.SourceFile
> = () => context => {
	// TODO do we want to do this?
	// how are unused imports handled? downstream?
	// perhaps this is where we split off typechecking from program emission.
	// it's possible that we just let our downstream tools warn on unused imports.
	// or the typechecking part of things does that.
	// we would need to parse the
	const visit: ts.Visitor = node => {
		if (ts.isImportDeclaration(node)) {
			// TODO this preserves all imports, but I don't fully understand how it works,
			// or if it should be done differently
			// console.log('VISIT IMPORT', node);
			// console.log('module specifier', node.moduleSpecifier.getText());
			const result = ts.createImportDeclaration(
				node.decorators,
				node.modifiers,
				node.importClause,
				node.moduleSpecifier,
			);
			// console.log('VISIT result', result);
			return result;
		}
		return ts.visitEachChild(node, child => visit(child), context);
	};
	return node => ts.visitNode(node, visit);
};
