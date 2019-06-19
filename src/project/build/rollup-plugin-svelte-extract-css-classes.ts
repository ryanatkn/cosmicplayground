import {walk} from 'svelte/compiler';
import {Node} from 'svelte/types/compiler/interfaces';
import {Plugin} from 'rollup';
import {cyan} from 'kleur';

import {assignDefaults} from '../../utils/obj';
import {noop} from '../../utils/fn';
import {CssClass} from '../../sy/sy';
import {SvelteUnrolledCompilation} from './rollup-plugin-svelte-unrolled';

export interface PluginOptions {
	classes: Set<CssClass>;
	getSvelteCompilation: (id: string) => SvelteUnrolledCompilation | undefined;
	verbose: boolean;
}
export type RequiredPluginOptions = 'getSvelteCompilation';
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = ({
	getSvelteCompilation,
}: InitialPluginOptions): PluginOptions => ({
	getSvelteCompilation,
	classes: new Set(), // TODO I don't like how this creates unnecessary garbage, even if it's miniscule; seems like poor design
	verbose: false,
});

export interface SvelteExtractCssClassesPlugin extends Plugin {
	getCssClasses(): Set<CssClass>;
}

export const name = 'svelte-extract-css-classes';

export const svelteExtractCssClassesPlugin = (
	pluginOptions: InitialPluginOptions,
): SvelteExtractCssClassesPlugin => {
	const {classes, getSvelteCompilation, verbose} = assignDefaults(
		defaultPluginOptions(pluginOptions),
		pluginOptions,
	);

	const log = verbose
		? (...args: any[]): void => {
				console.log(cyan(`[${name}]`), ...args);
		  }
		: noop;

	return {
		name,
		// TODO ok ... so this currently tracks ALL classes
		// do we instead want to track `classesByCssId`?
		// if we do that it allows us to track classes atomically in the rollup build,
		// but the downside is that they need to be combined or iterated through
		// in the removal process, which is going to be less efficient.
		getCssClasses: () => classes,
		transform(_code, id) {
			const compilation = getSvelteCompilation(id);
			if (!compilation) return null;
			log('transform', id);
			extractCssClassesFromHtml(compilation.ast.html, classes, log); // TODO return stats!
			return null;
		},
	};
};

// Mutates `classes` set, adding any css classes found in the html `ast`.
const extractCssClassesFromHtml = (
	ast: Node,
	classes: Set<CssClass>,
	log: typeof noop,
): void => {
	walk(ast, {
		enter(node, _parent, _prop, _index) {
			if (node.name === 'class' && node.type === 'Attribute') {
				extractCssClassesFromNode(node, classes, log);
			}
		},
		// leave(node, parent, prop, index) {},
	});
};

// TODO better way to do this?
// support more things like certain CallExpression/ArrayExpression patterns?
// enter/exit stack tracking w/ children maybe?
// so we know if we're "inside" a class attribute no matter how complicated it gets

const extractCssClassesFromNode = (
	node: Node,
	classes: Set<CssClass>,
	log: typeof noop,
) => {
	// log(`enter node`, node);

	const addClasses = (rawText: string) => {
		for (const c of rawText.split(' ').filter(Boolean)) {
			classes.add(c);
		}
	};
	switch (node.type) {
		case 'Attribute': {
			if (node.name !== 'class') {
				// TODO invariant/assert
				throw Error(`Expected node name to be "class": ${node.name}`);
			}
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
