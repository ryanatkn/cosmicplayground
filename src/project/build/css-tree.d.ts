// This is hacky, but works around the broken css-tree types
// when importing modules directly from `css-tree/lib/`,
// which is done to avoid importing a ton of unused javascript and json data.
// We could try to use svelte's parser directly by hacking in a `<style>`
// tag and removing the dependency on css-tree, but...hmm...

declare module 'css-tree/lib/parser' {
	import {ParseOptions, CssNode} from 'css-tree';
	export type Parse = (text: string, options?: ParseOptions) => CssNode;
}

declare module 'css-tree/lib/convertor' {
	// Svelte's `Node` is compatible with css-tree's `CssNodePlain`
	// for our purposes, even if the types are not, so we hack it.
	// We're using Svelte's AST and walk for everything instead of css-tree.
	import {Node} from 'svelte/types/compiler/interfaces';
	import {CssNode} from 'css-tree';
	export function toPlainObject(node: CssNode): Node;
	export function fromPlainObject(node: Node): CssNode;
}

declare module 'css-tree/lib/generator' {
	import {CssNode} from 'css-tree';
	export function translate(node: CssNode): string;
}
