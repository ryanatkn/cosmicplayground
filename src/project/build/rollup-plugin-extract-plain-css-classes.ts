import svelteCompiler from 'svelte/compiler.js';
const {walk} = svelteCompiler;
import {Plugin} from 'rollup';
import {green, gray} from '@feltcoop/gro/dist/colors/terminal.js';
import parse from 'css-tree/lib/parser/index.js';
import cssTreeConvertor from 'css-tree/lib/convertor/index.js';
const {toPlainObject} = cssTreeConvertor;
import {createFilter} from '@rollup/pluginutils';
import {Style} from 'svelte/types/compiler/interfaces.js';

import {LogLevel, logger, Logger} from '../logger.js';
import {CssClassesCache} from './cssClassesCache.js';
import {omitUndefined} from '../../utils/obj.js';
import {SyCssBuild} from './rollup-plugin-output-css.js';

export interface PluginOptions {
	getCssBuild(id: string): SyCssBuild;
	cssClasses: CssClassesCache;
	removeUnusedClasses: boolean;
	include: string | RegExp | (string | RegExp)[] | null;
	exclude: string | RegExp | (string | RegExp)[] | null;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'getCssBuild' | 'cssClasses';
export type InitialPluginOptions = PartialExcept<PluginOptions, RequiredPluginOptions>;
export const defaultPluginOptions = (initialOptions: InitialPluginOptions): PluginOptions => ({
	removeUnusedClasses: false,
	include: '**/*.css',
	exclude: null,
	logLevel: LogLevel.Info,
	...omitUndefined(initialOptions),
});

export const name = 'extract-plain-css-classes';

export const extractPlainCssClassesPlugin = (pluginOptions: InitialPluginOptions): Plugin => {
	const {
		getCssBuild,
		cssClasses,
		removeUnusedClasses,
		include,
		exclude,
		logLevel,
	} = defaultPluginOptions(pluginOptions);

	const log = logger(logLevel, [green(`[${name}]`)]);
	const {info} = log;

	const filter = createFilter(include, exclude);

	return {
		name,
		async transform(_code, id) {
			if (!filter(id)) return;
			// handle *.css imports - styles from `sy` and `.svelte`
			// files are handled elsewhere
			info(`transform id`, id);

			// `code` is an empty string because of the plain css plugin, so we load it
			const cssBuild = getCssBuild(id);
			const {code} = cssBuild;

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
			// https://github.com/sveltejs/svelte/tree/0b836872cf50f25eb643cf24e57a85cf6db31cbe/src/compiler/parse/read/style.ts
			const ast: Style = toPlainObject(parsedAst) as any;
			const classes = new Set<string>();
			extractCssClassesFromStyles(ast, classes, log);
			cssClasses.setDefinedCssClasses(id, classes);

			// TODO emit asset or use the incoming emitFile api
			// TODO this is hacky.. but caching isn't the right answer, because that's for changed code
			cssBuild.ast = ast;
			cssBuild.removeUnusedClasses = removeUnusedClasses;

			return '';
		},
	};
};

// Mutates `classes` set, adding any css classes found in the css ast.
// Utility classes cannot be used by svelte,
// but we need some solution for including classes that are referenced
// in global svelte styles, css files, or otherwise outside of the `sy` config.
const extractCssClassesFromStyles = async (
	ast: Style,
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
