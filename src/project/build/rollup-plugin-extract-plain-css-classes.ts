import {walk} from 'svelte/compiler';
import {Node} from 'svelte/types/compiler/interfaces';
import {Plugin} from 'rollup';
import {green, gray} from 'kleur';
import * as csstreeParse from 'css-tree/lib/parser';
import {Parse} from 'css-tree/lib/parser';
import {toPlainObject} from 'css-tree/lib/convertor';
import {createFilter} from 'rollup-pluginutils';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger, Logger} from '../logger';
import {CssBuild} from './rollup-plugin-output-css';
import {CssClassesCache} from './cssClassesCache';

// This is hacky, but works around the broken css-tree types
// when importing modules directly from `css-tree/lib/`,
// which is done to avoid importing a ton of unused javascript and json data.
// We could try to use svelte's parser directly by hacking in a `<style>`
// tag and removing the dependency on css-tree, but...hmm...
const parse = csstreeParse as Parse;

export interface PluginOptions {
	cacheCss(id: string, css: string | CssBuild): boolean;
	cssClasses: CssClassesCache;
	include: string | RegExp | (string | RegExp)[] | null | undefined;
	exclude: string | RegExp | (string | RegExp)[] | null | undefined;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'cacheCss' | 'cssClasses';
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = ({
	cacheCss,
	cssClasses,
}: InitialPluginOptions): PluginOptions => ({
	cacheCss,
	cssClasses,
	include: ['**/*.css'],
	exclude: undefined,
	logLevel: LogLevel.Info,
});

export const name = 'extract-plain-css-classes';

export const extractPlainCssClassesPlugin = (
	pluginOptions: InitialPluginOptions,
): Plugin => {
	const {cacheCss, cssClasses, include, exclude, logLevel} = assignDefaults(
		defaultPluginOptions(pluginOptions),
		pluginOptions,
	);

	const log = logger(logLevel, [green(`[${name}]`)]);
	const {info} = log;

	const filter = createFilter(include, exclude);

	return {
		name,
		async transform(code, id) {
			// TODO is this plugin doing too much?
			if (!filter(id)) return;
			// handle *.css imports - styles from `sy` and `.svelte`
			// files are handled elsewhere
			// TODO handle multiple bundles? or just one?
			info(`transform id`, id);

			// TODO emit asset or use the incoming emitFile api
			// TODO hmm.. combine caching css and classes? or keep separate?
			const updatedCache = cacheCss(id, code); // TODO is this cache check ever false?
			info('updated cache:', updatedCache);
			if (updatedCache) {
				// TODO this needs to be rethought
				// ideally we forward css instead of adding it to the cache here, and let rollup handle caching
				// we need to parse the css and update classes, but only if the cache changed
				// doing this seems like we're mixing concerns across files though

				// TODO with the file emit api, we'll want to return this AST from this `transform` fn
				const parsedAst = parse(code, {positions: false});
				// TODO consider changing this - could walk once for example, but then the AST is incompatible with svelte's
				// maybe JSON.parse(JSON.stringify()) performs ok? maybe not lol. PR to svelte if significant?
				// https://github.com/csstree/csstree/issues/47
				// Svelte jses JSON.parse(JSON.stringify(parsedAst))
				// https://github.com/sveltejs/svelte/blob/0b836872cf50f25eb643cf24e57a85cf6db31cbe/src/compiler/parse/read/style.ts
				// const estreeAst = JSON.parse(JSON.stringify(parsedAst));
				const estreeAst = toPlainObject(parsedAst);
				const classes = new Set<string>();
				extractCssClassesFromStyles(estreeAst, classes, log);
				cssClasses.setDefinedCssClasses(id, classes);
			}
			return '';
		},
	};
};

// Mutates `classes` set, adding any css classes found in the css ast.
// Utility classes cannot be used by svelte,
// but we need some solution for including classes that are referenced
// in global svelte styles, css files, or otherwise outside of the `sy` config.
const extractCssClassesFromStyles = async (
	ast: Node,
	classes: Set<string>,
	log: Logger,
): Promise<void> => {
	walk(ast, {
		enter(node, _parent, _prop, _index) {
			if (node.type === 'ClassSelector') {
				log.trace(gray('found class'), node.name);
				classes.add(node.name);
			}
		},
	});
};