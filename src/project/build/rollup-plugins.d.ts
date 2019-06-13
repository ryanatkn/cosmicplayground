// TODO where's this type? not shipped with Svelte?
interface SvelteCompilerOptions {
	filename?: string; // (null) string used for debugging hints and sourcemaps. Your bundler plugin will set it automatically.
	name?: string; // ("Component") string that sets the name of the resulting JavaScript class (though the compiler will rename it if it would otherwise conflict with other variables in scope). It will normally be inferred from filename.
	format?: 'esm' | 'cjs'; // ("esm") If "esm", creates a JavaScript module (with import and export). If "cjs", creates a CommonJS module (with require and module.exports), which is useful in some server-side rendering situations or for testing.
	generate?: 'dom' | 'ssr'; // ("dom") If "dom", Svelte emits a JavaScript class for mounting to the DOM. If "ssr", Svelte emits an object with a render method suitable for server-side rendering. If false, no JavaScript or CSS is returned; just metadata.
	dev?: boolean; // (false) If true, causes extra code to be added to components that will perform runtime checks and provide debugging information during development.
	immutable?: boolean; // (false) If true, tells the compiler that you promise not to mutate any objects. This allows it to be less conservative about checking whether values have changed.
	hydratable?: boolean; // (false) If true, enables the hydrate: true runtime option, which allows a component to upgrade existing DOM rather than creating new DOM from scratch.
	legacy?: boolean; // (false) If true, generates code that will work in IE9 and IE10, which don't support things like element.dataset.
	accessors?: boolean; // (false) If true, getters and setters will be created for the component's props. If false, they will only be created for readonly exported values (i.e. those declared with const, class and function). If compiling with customElement: true this option defaults to true.
	customElement?: boolean; // (false) If true, tells the compiler to generate a custom element constructor instead of a regular Svelte component.
	tag?: string; // (null) A string that tells Svelte what tag name to register the custom element with. It must be a lowercase alphanumeric string with at least one hyphen, e.g. "my-element".
	css?: boolean; // (true) If true, styles will be included in the JavaScript class and injected at runtime. It's recommended that you set this to false and use the CSS that is statically generated, as it will result in smaller JavaScript bundles and better performance.
	preserveComments?: boolean; // (false) If true, your HTML comments will be preserved during server-side rendering. By default, they are stripped out.
	preserveWhitespace?: boolean; // (false) If true, whitespace inside and between elements is kept as you typed it, rather than optimised by Svelte.
	outputFilename?: string | null; // (null) A string used for your JavaScript sourcemap.
	cssOutputFilename?: string | null; // (null) A string used for your CSS sourcemap.
	sveltePath?: string; // ("svelte") The location of the svelte package. Any imports from svelte or svelte/[module] will be modified accordingly.
}

declare module 'rollup-plugin-svelte' {
	import { WarningHandler, RollupWarning, Plugin, SourceMap } from "rollup";

	class CssWriter {
		constructor(
			code: string,
			map: SourceMap,
			warn: WarningHandler,
		);
		code: string;
		map: object;
		warn: WarningHandler;
		write(dest: string, map: boolean): void;
		toString(): string;
	}

	interface RollupPluginSvelteOptions extends StrictOmit<SvelteCompilerOptions, 'css'> {
		extensions?: string[];
		include?: string;
		exclude?: string;
		preprocess?: {[key: string]: (...args: any[]) => any}; // TODO
		emitCss?: boolean;
		css?(css: CssWriter): void;
		onwarn?(warning: RollupWarning, handler: WarningHandler): void;
	}

	// function RollupPluginSvelte<T extends minimist.ParsedArgs>(args?: string[], opts?: minimist.Opts): T;
	function RollupPluginSvelte(options: RollupPluginSvelteOptions): Plugin;

	namespace RollupPluginSvelte {
		// this namespace is needed to avoid using TypeScript's `esModuleInterop`
	}

	export = RollupPluginSvelte;
}

declare module 'rollup-plugin-terser';
declare module 'rollup-plugin-serve';
declare module 'rollup-plugin-typescript';
