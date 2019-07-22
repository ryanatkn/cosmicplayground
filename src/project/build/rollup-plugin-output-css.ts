import {Plugin, ExistingRawSourceMap} from 'rollup';
import {outputFile} from 'fs-extra';
import {blue, gray} from 'kleur';
import * as fp from 'path';
import {decode, encode, SourceMapSegment} from 'sourcemap-codec';
import {Node} from 'svelte/types/compiler/interfaces';
import {walk} from 'svelte/compiler';
import {translate} from 'css-tree/lib/generator'; // TODO import directly - maybe lazily?
import {fromPlainObject} from 'css-tree/lib/convertor';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger, fmtVal, Logger} from '../logger';
import {toRootPath} from '../paths';
import {CssClassesCache} from './cssClassesCache';

// TODO this is error prone - we're not expecting to have a `map` and an `ast` for example
export interface CssBuild {
	code: string;
	map: ExistingRawSourceMap | undefined; // TODO review this type - `{mappings: ''}`?
	ast?: Node;
	removeUnusedClasses?: boolean;
}

export type CssBundle = {
	bundleName: string;
	buildsById: Map<string, CssBuild>;
	changedIds: Set<string>;
};

export interface PluginOptions {
	sourcemap: boolean; // TODO consider per-bundle options
	logLevel: LogLevel;
	cssClasses: CssClassesCache | undefined;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = (): PluginOptions => ({
	sourcemap: false,
	logLevel: LogLevel.Info,
	cssClasses: undefined,
});

export interface PlainCssPlugin extends Plugin {
	cacheCss(bundleName: string, id: string, css: CssBuild): boolean;
}

export const name = 'output-css';

// TODO this really just outputs css - but it'll probably be refactored
export const outputCssPlugin = (
	pluginOptions: InitialPluginOptions,
): PlainCssPlugin => {
	const {sourcemap, logLevel, cssClasses} = assignDefaults(
		defaultPluginOptions(),
		// {sourcemap: pluginOptions.dev}, // TODO dev flag?
		pluginOptions,
	);
	const log = logger(logLevel, [blue(`[${name}]`)]);
	const {info} = log;

	// `bundles` key is an output file name,
	// and the value is css by id.
	// Return a bool indicating if the cache was updated.
	const bundles = new Map<string, CssBundle>();
	const cacheCss = (
		bundleName: string,
		id: string,
		build: CssBuild,
	): boolean => {
		let bundle = bundles.get(bundleName);
		if (!bundle) {
			bundle = {bundleName, buildsById: new Map(), changedIds: new Set()};
			bundles.set(bundleName, bundle);
		}

		const cachedBuild = bundle.buildsById.get(id);
		// I think this comparison is safe - sourcemap should change iif code changes, eh?
		if (build.code === (cachedBuild && cachedBuild.code)) return false;

		info(fmtVal('caching', toRootPath(id)), fmtVal('bundle', bundleName));
		bundle.buildsById.set(id, build);
		bundle.changedIds.add(id);

		return true;
	};

	return {
		name,
		// TODO rewrite when the emit file API is ready https://github.com/rollup/rollup/issues/2938
		cacheCss,
		async generateBundle(outputOptions, _bundle, isWrite) {
			if (!isWrite) return;

			info('generateBundle');

			// TODO chunks!
			const outFile = outputOptions.file;
			if (!outFile) throw Error(`Expected outputOptions.file: ${outFile}`);
			const outDir = fp.dirname(outFile);

			// write each changed bundle to disk
			for (const {bundleName, buildsById, changedIds} of bundles.values()) {
				if (!changedIds.size) continue;

				info('generating css bundle', blue(bundleName));
				info('changes', Array.from(changedIds)); // TODO trace when !watch
				changedIds.clear();

				const mappings: SourceMapSegment[][] = [];
				const sources: string[] = [];
				const sourcesContent: string[] = [];

				let cssStrings: string[] = [];
				for (const build of buildsById.values()) {
					const code = toFinalCode(build, cssClasses, log);
					if (!code) continue;
					cssStrings.push(code);

					// add css source map
					// TODO do we we ever want a warning if `build.map` is undefined?
					if (sourcemap && build.map && build.map.sourcesContent) {
						const sourcesLength = sources.length;
						sources.push(build.map.sources[0]);
						sourcesContent.push(build.map.sourcesContent[0]);
						const decoded = decode(build.map.mappings);
						if (sourcesLength > 0) {
							for (const line of decoded) {
								for (const segment of line) {
									segment[1] = sourcesLength;
								}
							}
						}
						mappings.push(...decoded);
					}
				}
				const css = cssStrings.join('\n');

				const dest = fp.join(outDir, bundleName);

				if (sources.length) {
					const sourcemapDest = dest + '.map';
					const finalCss =
						css + `\n/*# sourceMappingURL=${bundleName}.map */\n`;
					const cssSourcemap = JSON.stringify(
						{
							version: 3,
							file: bundleName,
							sources: sources.map(s => fp.relative(outDir, s)),
							sourcesContent,
							names: [],
							mappings: encode(mappings),
						},
						null,
						2,
					);

					info('writing css bundle and sourcemap', dest);
					await Promise.all([
						outputFile(dest, finalCss),
						outputFile(sourcemapDest, cssSourcemap),
					]);
				} else {
					info('writing css bundle', dest);
					await outputFile(dest, css);
				}
			}
		},
	};
};

const toFinalCode = (
	{code, ast, removeUnusedClasses}: CssBuild,
	cssClasses: CssClassesCache | undefined,
	{trace, warn}: Logger,
): string => {
	if (!removeUnusedClasses) return code;
	if (!ast) {
		warn(`Expected AST with 'removeUnusedClasses'`);
		return code;
	}
	if (!cssClasses) {
		warn(`Expected cssClasses with 'removeUnusedClasses'`);
		return code;
	}

	// Remove unused classes from the AST, then reconstruct the css.
	// There is _definitely_ a better, faster, more idiomatic way to do this.

	const usedClasses = cssClasses.getUsedCssClasses();
	const rulesToRemove = new Set<Node>();
	const selectorsToRemove = new Set<Node>();
	let rule: Node | undefined;
	let selectorList: Node | undefined;
	walk(ast, {
		enter(node, parent, _prop, _index) {
			if (node.type === 'Rule') {
				rule = node;
			} else if (node.type === 'SelectorList') {
				selectorList = node;
			} else if (node.type === 'ClassSelector') {
				if (usedClasses.has(node.name)) {
					return;
				}
				trace(gray('removing unused class'), node.name);
				if (!rule) {
					throw Error(`Expected to be inside a rule`);
				}
				if (!selectorList || !selectorList.children) {
					throw Error(`Expected to be inside a selector list with children`);
				}
				if (!parent) {
					throw Error(`Expected to have a parent`);
				}
				if (selectorList.children.length === 1) {
					rulesToRemove.add(rule);
				} else {
					selectorsToRemove.add(parent);
				}
			}
		},
	});

	if (rulesToRemove.size === 0 && selectorsToRemove.size === 0) return code;

	const trimmedAst: Node = {
		...ast,
		children:
			ast.children &&
			ast.children.reduce(
				(rules, rule) => {
					// skip if whole rule is ignored
					if (rulesToRemove.has(rule)) {
						return rules;
					}

					// remove any appropriate children in the selector list
					if (rule.selector && rule.selector.children) {
						rule.selector.children = rule.selector.children.filter(
							(c: Node) => !selectorsToRemove.has(c),
						);
						// remove the whole thing if there are no rules left
						if (rule.selector.children.length === 0) {
							return rules;
						}
					}

					// add the rule, because nothing short-circuited
					rules.push(rule);
					return rules;
				},
				[] as Node[],
			),
	};

	const trimmedCode = translate(fromPlainObject(trimmedAst));

	return trimmedCode;
};
