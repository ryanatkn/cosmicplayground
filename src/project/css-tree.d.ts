// This is hacky, but works around the broken css-tree types
// when importing modules directly from `css-tree/lib/`,
// which is done to avoid importing a ton of unused javascript and json data.
// We could try to use svelte's parser directly by hacking in a `<style>`
// tag and removing the dependency on css-tree, but...hmm...

declare module 'css-tree/lib/parser/index.js' {
	import {ParseOptions, CssNode, parse} from 'css-tree';
	export type Parse = (text: string, options?: ParseOptions) => CssNode;
	export default parse;
}

declare module 'css-tree/lib/convertor/index.js' {
	// Svelte's `Node` is compatible with css-tree's `CssNodePlain`
	// for our purposes, even if the types are not, so we hack it.
	// We're using Svelte's AST and walk for everything instead of css-tree.
	import {Node} from 'estree';
	import {CssNode} from 'css-tree';
	const convertor: {
		toPlainObject(node: CssNode): Node;
		fromPlainObject(node: Node): CssNode;
	};
	export default convertor;
}

declare module 'css-tree/lib/generator/index.js' {
	import {CssNode} from 'css-tree';
	export function translate(node: CssNode): string;
}
