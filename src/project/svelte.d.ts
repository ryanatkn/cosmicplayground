declare module 'svelte/compiler.js' {
	import {TemplateNode, Style} from 'svelte/types/compiler/interfaces.js';
	import {CssNode} from 'css-tree';

	export {compile, parse, preprocess, VERSION} from 'svelte/types/compiler/index';

	// TODO fix this upstream? `walk` is not exported
	export function walk(ast: Style, options: WalkerOptions<CssNode>): void;
	export function walk(ast: TemplateNode, options: WalkerOptions<TemplateNode>): void;
	export type WalkerContext = {
		skip: () => void;
	};
	export type WalkerListener<T> = (
		this: WalkerContext,
		node: T,
		parent?: T,
		prop?: string,
		index?: number,
	) => void;
	export interface WalkerOptions<T> {
		enter?: WalkerListener<T>;
		leave?: WalkerListener<T>;
	}
}
