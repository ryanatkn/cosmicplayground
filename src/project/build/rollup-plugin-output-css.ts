import {Plugin} from 'rollup';
import {outputFile} from '@feltcoop/gro/dist/fs/nodeFs.js';
import {blue, gray} from '@feltcoop/gro/dist/colors/terminal.js';
import * as fp from 'path';
import {SourceMapSegment} from 'sourcemap-codec';
import sourcemapCodec from 'sourcemap-codec';
import {Style} from 'svelte/types/compiler/interfaces.js';
import svelteCompiler from 'svelte/compiler.js';
const {walk} = svelteCompiler;
import * as cssTreeGenerator from 'css-tree/lib/generator/index.js'; // TODO import directly - maybe lazily?
const {translate} = cssTreeGenerator;
import cssTreeConvertor from 'css-tree/lib/convertor/index.js';
const {fromPlainObject} = cssTreeConvertor;
import {CssNode} from 'css-tree';
import {GroCssBundle, GroCssBuild} from '@feltcoop/gro/dist/project/types.js';
import {dirname} from 'path';

import {LogLevel, logger, Logger} from '../logger.js';
import {CssClassesCache} from './cssClassesCache.js';
import {omitUndefined} from '../../utils/obj.js';

export interface SyCssBuild extends GroCssBuild {
	ast?: Style;
	removeUnusedClasses?: boolean;
}

export type CssBundle = {
	bundleName: string;
	buildsById: Map<string, SyCssBuild>;
	changedIds: Set<string>;
};

export interface PluginOptions {
	getCssBundles(): Map<string, GroCssBundle>;
	sourcemap: boolean; // TODO consider per-bundle options
	logLevel: LogLevel;
	cssClasses: CssClassesCache | undefined;
}
export type RequiredPluginOptions = 'getCssBundles';
export type InitialPluginOptions = PartialExcept<PluginOptions, RequiredPluginOptions>;
export const defaultPluginOptions = (initialOptions: InitialPluginOptions): PluginOptions => ({
	sourcemap: false,
	logLevel: LogLevel.Info,
	cssClasses: undefined,
	...omitUndefined(initialOptions),
});

export interface PlainCssPlugin extends Plugin {}

export const name = 'output-css';

// TODO this really just outputs css - but it'll probably be refactored
export const outputCssPlugin = (pluginOptions: InitialPluginOptions): PlainCssPlugin => {
	const {getCssBundles, sourcemap, logLevel, cssClasses} = defaultPluginOptions(pluginOptions);

	const log = logger(logLevel, [blue(`[${name}]`)]);
	const {info} = log;

	return {
		name,
		async generateBundle(outputOptions, _bundle, isWrite) {
			if (!isWrite) return;

			info('generateBundle');

			// TODO chunks!
			const outputDir = outputOptions.dir || dirname(outputOptions.file!);

			// write each changed bundle to disk
			for (const {bundleName, buildsById, changedIds} of getCssBundles().values()) {
				if (!changedIds.size) continue;

				info('generating css bundle', blue(bundleName));
				info('changes', Array.from(changedIds)); // TODO trace when !watch
				changedIds.clear();

				const mappings: SourceMapSegment[][] = [];
				const sources: string[] = [];
				const sourcesContent: string[] = [];

				// sort the css builds, so the cascade works according to import order
				const builds = Array.from(buildsById.values()).sort((a, b) =>
					a.sortIndex === b.sortIndex ? (a.id > b.id ? 1 : -1) : a.sortIndex > b.sortIndex ? 1 : -1,
				);

				let cssStrings: string[] = [];
				for (const build of builds) {
					const code = toFinalCode(build, cssClasses, log);
					if (!code) continue;
					cssStrings.push(code);

					// add css source map
					// TODO do we we ever want a warning if `build.map` is undefined? YES! it breaks the others
					if (sourcemap && build.map && build.map.sourcesContent) {
						const sourcesLength = sources.length;
						sources.push(build.map.sources[0]);
						sourcesContent.push(build.map.sourcesContent[0]);
						const decoded = sourcemapCodec.decode(build.map.mappings);
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

				const dest = fp.join(outputDir, bundleName);

				if (sources.length) {
					const sourcemapDest = dest + '.map';
					const finalCss = css + `\n/*# sourceMappingURL=${bundleName}.map */\n`;
					const cssSourcemap = JSON.stringify(
						{
							version: 3,
							file: bundleName,
							sources: sources.map((s) => fp.relative(outputDir, s)),
							sourcesContent,
							names: [],
							mappings: sourcemapCodec.encode(mappings),
						},
						null,
						2,
					);

					info('writing css bundle and sourcemap', dest);
					await Promise.all([outputFile(dest, finalCss), outputFile(sourcemapDest, cssSourcemap)]);
				} else {
					info('writing css bundle', dest);
					await outputFile(dest, css);
				}
			}
		},
	};
};

const toFinalCode = (
	{code, ast, removeUnusedClasses}: SyCssBuild,
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
	const rulesToRemove = new Set<CssNode>();
	const selectorsToRemove = new Set<CssNode>();
	let rule: CssNode | undefined;
	let selectorList: CssNode | undefined;
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
				if (!selectorList || !('children' in selectorList)) {
					throw Error(`Expected to be inside a selector list with children`);
				}
				if (!parent) {
					throw Error(`Expected to have a parent`);
				}
				if (selectorList.children && selectorList.children.getSize() === 1) {
					rulesToRemove.add(rule);
				} else {
					selectorsToRemove.add(parent);
				}
			}
		},
	});

	if (rulesToRemove.size === 0 && selectorsToRemove.size === 0) return code;

	const trimmedAst: Style = {
		...ast,
		children:
			ast.children &&
			// TODO types?
			ast.children.reduce((rules: any, rule: any) => {
				// skip if whole rule is ignored
				if (rulesToRemove.has(rule)) {
					return rules;
				}

				// remove any appropriate children in the selector list
				if (rule.selector && rule.selector.children) {
					rule.selector.children = rule.selector.children.filter(
						(c: CssNode) => !selectorsToRemove.has(c),
					);
					// remove the whole thing if there are no rules left
					if (rule.selector.children.length === 0) {
						return rules;
					}
				}

				// add the rule, because nothing short-circuited
				rules.push(rule);
				return rules;
			}, [] as CssNode[]),
	};

	const trimmedCode = translate(fromPlainObject(trimmedAst as any));

	return trimmedCode;
};
