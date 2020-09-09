import svelteCompiler from 'svelte/compiler.js';
const {walk} = svelteCompiler;
import {Plugin} from 'rollup';
import {cyan} from '@feltcoop/gro/dist/colors/terminal.js';
import cssTree from 'css-tree';
import {TemplateNode, Style, Script} from 'svelte/types/compiler/interfaces.js';
import {printPath} from '@feltcoop/gro/dist/utils/print.js';
import {GroSvelteCompilation} from '@feltcoop/gro/dist/project/rollup-plugin-gro-svelte.js';
import {createStopwatch} from '@feltcoop/gro/dist/utils/time.js';
import {omitUndefined} from '@feltcoop/gro/dist/utils/object.js';

import {CssClass} from '../../sy/sy.js';
import {LogLevel, logger, Logger, fmtVal, fmtMs} from '../logger.js';
import {CssClassesCache} from './cssClassesCache.js';

// TODO remove unused plain css classes in prod (groundwork is now laid with `cssClassesCache`)
// TODO class directives! `class:active={isActive}`
// TODO bundle vision! that should show you classes (and warn on undefined ones)
//   probably need to change the way classes are stored/deleted for this
// TODO fill in use cases when they're encountered.
//   For now this supports the `cls('class literals')` and
//   some attribute patterns like `class="foo {a ? 'b' : 'c'}"`.
// TODO simple identifers?
// TODO investigate using workers to speed this up

export interface PluginOptions {
	cssClasses: CssClassesCache;
	classAttrMatcher: RegExp;
	classFnMatcher: RegExp;
	getSvelteCompilation: (id: string) => GroSvelteCompilation | undefined;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'cssClasses' | 'getSvelteCompilation';
export type InitialPluginOptions = PartialExcept<PluginOptions, RequiredPluginOptions>;
export const defaultPluginOptions = (initialOptions: InitialPluginOptions): PluginOptions => ({
	classAttrMatcher: new RegExp(/^(class|.+Class)$/),
	classFnMatcher: new RegExp(/^(cls)$/), // TODO consider renaming: sy, cn, ..
	logLevel: LogLevel.Info,
	...omitUndefined(initialOptions),
});

export const name = 'extract-svelte-css-classes';

export const extractSvelteCssClassesPlugin = (pluginOptions: InitialPluginOptions): Plugin => {
	const {
		cssClasses,
		classAttrMatcher,
		classFnMatcher,
		getSvelteCompilation,
		logLevel,
	} = defaultPluginOptions(pluginOptions);

	const log = logger(logLevel, [cyan(`[${name}]`)]);
	const {info} = log;

	return {
		name,
		async transform(_code, id) {
			const compilation = getSvelteCompilation(id);
			if (!compilation) return null;

			// add used classes from the svelte markup and scripts
			const elapsed = createStopwatch();
			const usedClasses = new Set<string>();
			extractCssClassesFromMarkup(compilation.ast.html, classAttrMatcher, usedClasses, log);
			extractCssClassesFromScript(compilation.ast.instance, classFnMatcher, usedClasses, log);
			extractCssClassesFromScript(compilation.ast.module, classFnMatcher, usedClasses, log);
			cssClasses.setUsedCssClasses(id, usedClasses);

			// add defined classes from the svelte styles
			const definedClasses = new Set<string>();
			extractCssClassesFromStyles(compilation.ast.css, definedClasses, log);
			cssClasses.setDefinedCssClasses(id, definedClasses);

			info(printPath(id), fmtVal('extract_classes', fmtMs(elapsed(), 2))); // TODO track with stats instead of logging
			return null;
		},
	};
};

// Mutates `classes` set, adding any css classes found in the html ast.
const extractCssClassesFromMarkup = (
	ast: TemplateNode,
	classAttrMatcher: RegExp,
	classes: Set<CssClass>,
	log: Logger,
): void => {
	walk(ast, {
		enter(node, _parent, _prop, _index) {
			if (
				(node.type === 'Attribute' && classAttrMatcher.test(node.name)) ||
				node.type === 'Class'
			) {
				// TODO can we grab basic identifiers without the `classFnMatcher`?
				extractCssClassesFromNode(node, classes, log);
			}
		},
		// leave(node, parent, prop, index) {},
	});
};

// Mutates `classes` set, adding any css classes found in the js ast.
const extractCssClassesFromScript = (
	ast: Script,
	classFnMatcher: RegExp,
	classes: Set<CssClass>,
	log: Logger,
): void => {
	walk(ast, {
		enter(node, parent, _prop, _index) {
			// TODO elide the function call? can we modify the ast?
			if (
				node.type === 'Identifier' &&
				parent &&
				parent.type === 'CallExpression' &&
				classFnMatcher.test(node.name)
			) {
				// if (parent.arguments.length !== 1) throw Error(`rely on typescript?`)
				extractCssClassesFromNode(parent.arguments[0], classes, log);
			}
		},
		// leave(node, parent, prop, index) {},
	});
};

// Mutates `classes` set, remove any css classes found in the css ast.
// Utility classes cannot be used by svelte,
// but we need some solution for including classes that are referenced
// in global svelte styles, css files, or otherwise outside of the `sy` config.
const extractCssClassesFromStyles = async (
	ast: Style,
	classes: Set<string>,
	log: Logger,
): Promise<void> => {
	walk(ast, {
		enter(node, parent, _prop, _index) {
			if (node.type === 'ClassSelector') {
				classes.add(node.name);
			} else if (
				parent &&
				parent.type === 'PseudoClassSelector' &&
				parent.name === 'global' &&
				node.type === 'Raw'
			) {
				// handle `:global(selectors)` because they're not parsed by svelte
				const parsedAst = cssTree.parse(node.value, {
					context: 'selectorList',
					positions: false,
				});
				// This looks terrible but it's what svelte does with css-tree's AST:
				// https://github.com/sveltejs/svelte/tree/0b836872cf50f25eb643cf24e57a85cf6db31cbe/src/compiler/parse/read/style.ts
				// Looks like it's because css-tree uses data structures
				// like a `List` for children instead of plain arrays.
				// TODO see the other notes with this link - https://github.com/csstree/csstree/issues/47
				// ideally we measure the differences here - walking once makes sense though, and calling `toArray`
				const estreeAst = JSON.parse(JSON.stringify(parsedAst));
				extractCssClassesFromStyles(estreeAst, classes, log);
			}
		},
	});
};

// TODO better way to do this?
// support more things like certain CallExpression/ArrayExpression patterns?
// enter/leave stack tracking w/ children maybe?

const CSS_CLASS_SPLITTER = /\s+/;

const extractCssClassesFromNode = (node: TemplateNode, classes: Set<CssClass>, log: Logger) => {
	// log.trace(`enter node`, node);
	const addClasses = (rawText: string) => {
		for (const c of rawText.split(CSS_CLASS_SPLITTER).filter(Boolean)) {
			classes.add(c);
		}
	};
	switch (node.type) {
		case 'Attribute': {
			// TODO is this a useful check or just worthless slowdown?
			// if (!classAttrMatcher.test(node.name)) {
			// 	throw Error(`Expected node name to be "class": ${node.name}`);
			// }
			for (const v of node.value) {
				extractCssClassesFromNode(v, classes, log);
			}
			break;
		}
		// the Svelte `class:foo` markup construct
		case 'Class': {
			addClasses(node.name);
			break;
		}
		// estree types
		case 'Literal': {
			addClasses(node.value);
			break;
		}
		case 'Identifier': {
			// not handling these (yet?)
			break;
		}
		case 'ParenthesizedExpression': {
			extractCssClassesFromNode(node.expression, classes, log);
			break;
		}
		// MemberExpression
		// NewExpression
		// CallExpression
		// ArrayExpression
		// UpdateExpression
		// UnaryExpression
		// BinaryExpression
		case 'LogicalExpression': {
			extractCssClassesFromNode(node.left, classes, log);
			extractCssClassesFromNode(node.right, classes, log);
			break;
		}
		case 'ConditionalExpression': {
			extractCssClassesFromNode(node.consequent, classes, log);
			extractCssClassesFromNode(node.alternate, classes, log);
			break;
		}
		case 'AssignmentExpression': {
			extractCssClassesFromNode(node.right, classes, log);
			break;
		}
		// YieldExpression
		// SpreadElement
		// SequenceExpression

		// svelte compiler types
		case 'Text': {
			// use `node.raw` because `node.data` contains
			// the generated svelte classes, e.g. `data: 'item svelte-1j9zaau'`
			addClasses((node as any).raw); // TODO does this still exist?
			break;
		}
		case 'MustacheTag': {
			extractCssClassesFromNode(node.expression, classes, log);
			break;
		}
		// BaseNode
		// Directive
		// Transition
		default: {
			break;
		}
	}
};
