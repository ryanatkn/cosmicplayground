import {walk} from 'svelte/compiler';
import {Node} from 'svelte/types/compiler/interfaces';
import {Plugin} from 'rollup';
import {cyan, gray} from 'kleur';
import {parse} from 'css-tree';

import {assignDefaults} from '../../utils/obj';
import {CssClass} from '../../sy/sy';
import {SvelteUnrolledCompilation} from './rollup-plugin-svelte-unrolled';
import {LogLevel, logger, Logger, fmtVal, fmtMs} from '../logger';
import {timeTracker} from '../scriptUtils';
import {toSrcPath} from '../paths';

// TODO class directives! `class:active={isActive}`
// TODO bundle vision! that should show you classes (and warn on undefined ones)
//   probably need to change the way classes are stored/deleted for this
// TODO fill in use cases when they're encountered.
//   For now this supports the `cls('class literals')` and
//   some attribute patterns like `class="foo {a ? 'b' : 'c'}"`.
// TODO simple identifers?
// TODO investigate using workers to speed this up

export interface PluginOptions {
	classAttrMatcher: RegExp;
	classFnMatcher: RegExp;
	usedClasses: Set<CssClass>;
	definedClassesById: Map<string, Set<CssClass>>;
	getSvelteCompilation: (id: string) => SvelteUnrolledCompilation | undefined;
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'getSvelteCompilation';
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = ({
	getSvelteCompilation,
}: InitialPluginOptions): PluginOptions => ({
	classAttrMatcher: new RegExp(/^(class|.+Class)$/),
	classFnMatcher: new RegExp(/^(cls)$/), // TODO consider renaming: sy, cn, ..
	usedClasses: new Set(),
	definedClassesById: new Map(),
	getSvelteCompilation,
	logLevel: LogLevel.Info,
});

export interface ExtractSvelteCssClassesPlugin extends Plugin {
	getUsedCssClasses(): Set<CssClass>;
	getDefinedCssClasses(): Set<CssClass>;
	setDefinedCssClasses(id: string, classes: Set<string>): void;
}

export const name = 'extract-svelte-css-classes';

export const extractSvelteCssClassesPlugin = (
	pluginOptions: InitialPluginOptions,
): ExtractSvelteCssClassesPlugin => {
	const {
		classAttrMatcher,
		classFnMatcher,
		usedClasses,
		definedClassesById,
		getSvelteCompilation,
		logLevel,
	} = assignDefaults(defaultPluginOptions(pluginOptions), pluginOptions);

	const log = logger(logLevel, [cyan(`[${name}]`)]);
	const {info} = log;

	// We store the defined classes by id in `definedClassesById`,
	// to enable quicker recomptuation after changes.
	// We're currently throwing away each file/id's classes and recomputing
	// whenever there's a change, to make sure we don't retain stale classes
	// that were removed.
	// TODO `recomputeDefinedClasses` could be much faster if we diffed which
	// classes get added/removed upstream
	const definedClasses = new Set<string>();
	let definedClassesChanged = true;
	const recomputeDefinedClasses = (): Set<string> => {
		info('recomputing defined classes');
		definedClasses.clear();
		for (const classes of definedClassesById.values()) {
			for (const cls of classes) {
				definedClasses.add(cls);
			}
		}
		return definedClasses;
	};
	const setDefinedCssClasses = (id: string, classes: Set<string>): void => {
		log.trace(gray('setDefinedCssClasses'), id, Array.from(classes));
		// TODO see above not about diffing classes that get added/removed upstream to increase perf
		definedClassesChanged = true;
		definedClassesById.set(id, classes);
	};

	return {
		name,
		// TODO ok ... so this currently tracks ALL classes
		// do we instead want to track `classesByCssId`?
		// if we do that it allows us to track classes atomically in the rollup build,
		// but the downside is that they need to be combined or iterated through
		// in the removal process, which is going to be less efficient.
		getUsedCssClasses: () => usedClasses,
		getDefinedCssClasses: () => {
			if (!definedClassesChanged) return definedClasses;
			definedClassesChanged = false;
			return recomputeDefinedClasses();
		},
		setDefinedCssClasses,
		async transform(_code, id) {
			const compilation = getSvelteCompilation(id);
			if (!compilation) return null;
			const elapsed = timeTracker();
			extractCssClassesFromMarkup(
				compilation.ast.html,
				classAttrMatcher,
				usedClasses,
				log,
			);
			extractCssClassesFromScript(
				compilation.ast.instance,
				classFnMatcher,
				usedClasses,
				log,
			);
			// add defined classes from the svelte styles
			const classes = new Set<string>();
			extractCssClassesFromStyles(compilation.ast.css, classes, log);
			setDefinedCssClasses(id, classes);

			info(gray(toSrcPath(id)), fmtVal('extract_classes', fmtMs(elapsed(), 2))); // TODO track with stats instead of logging
			return null;
		},
	};
};

// Mutates `classes` set, adding any css classes found in the html ast.
const extractCssClassesFromMarkup = (
	ast: Node,
	classAttrMatcher: RegExp,
	classes: Set<CssClass>,
	log: Logger,
): void => {
	walk(ast, {
		enter(node, _parent, _prop, _index) {
			if (node.type === 'Attribute' && classAttrMatcher.test(node.name)) {
				// TODO can we grab basic identifiers without the `classFnMatcher`?
				extractCssClassesFromNode(node, classes, log);
			}
		},
		// leave(node, parent, prop, index) {},
	});
};

// Mutates `classes` set, adding any css classes found in the js ast.
const extractCssClassesFromScript = (
	ast: Node,
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
	ast: Node,
	classes: Set<string>,
	log: Logger,
): Promise<void> => {
	walk(ast, {
		enter(node, parent, _prop, _index) {
			if (node.type === 'ClassSelector') {
				classes.add(node.name);
			} else if (
				parent &&
				parent.name === 'global' &&
				parent.type === 'PseudoClassSelector' &&
				node.type === 'Raw'
			) {
				// handle `:global(selectors)` because they're not parsed by svelte
				const parsedAst = parse(node.value, {
					context: 'selectorList',
					positions: false,
				});
				// This looks terrible but it's what svelte does with css-tree's AST:
				// https://github.com/sveltejs/svelte/blob/0b836872cf50f25eb643cf24e57a85cf6db31cbe/src/compiler/parse/read/style.ts
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

const extractCssClassesFromNode = (
	node: Node,
	classes: Set<CssClass>,
	log: Logger,
) => {
	// log.trace(`enter node`, node);
	const addClasses = (rawText: string) => {
		for (const c of rawText.split(' ').filter(Boolean)) {
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
			addClasses(node.raw);
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
