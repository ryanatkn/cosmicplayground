import {compile} from 'svelte/compiler';
import {CompileOptions} from 'svelte/types/compiler/interfaces';
import {
	Plugin,
	PluginContext,
	RollupWarning,
	ExistingRawSourceMap,
} from 'rollup';
import {createFilter} from 'rollup-pluginutils';
import {magenta} from 'kleur';

import {assignDefaults} from '../../utils/obj';
import {extractFilename, replaceExt} from '../scriptUtils';
import {LogLevel, logger, fmtVal, fmtMs} from '../logger';
import {toSrcPath} from '../paths';
import {CssBuild} from './rollup-plugin-plain-css';

// TODO type could be improved, not sure how tho
interface Stats {
	timings: {
		total: number;
		parse?: {total: number};
		'create component'?: {total: number};
	};
}
// TODO type belongs upstream - augmented for better safety
export type SvelteCompilation = OmitStrict<
	ReturnType<typeof compile>,
	'js' | 'css' | 'stats'
> & {
	js: {
		code: string;
		map: string | {mappings: ''} | ExistingRawSourceMap | undefined;
	};
	css: CssBuild;
	stats: Stats;
};

export type SvelteUnrolledCompilation = SvelteCompilation & {
	id: string;
	cssId: string | undefined;
};

export interface PluginOptions {
	dev: boolean;
	cacheCss(id: string, css: string | CssBuild): boolean;
	include: string | RegExp | (string | RegExp)[] | null | undefined;
	exclude: string | RegExp | (string | RegExp)[] | null | undefined;
	compileOptions: CompileOptions;
	compilations: Map<string, SvelteUnrolledCompilation>;
	logLevel: LogLevel;
	onwarn:
		| undefined
		| ((
				id: string,
				warning: RollupWarning | string,
				warn: (id: string, warning: RollupWarning | string) => void,
				pluginContext: PluginContext,
		  ) => void);
	onstats:
		| undefined
		| ((
				id: string,
				stats: Stats,
				handleStats: (id: string, stats: Stats) => void,
				pluginContext: PluginContext,
		  ) => void);
}
export type RequiredPluginOptions = 'dev' | 'cacheCss';
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = ({
	dev,
	cacheCss,
}: InitialPluginOptions): PluginOptions => ({
	dev,
	cacheCss,
	include: ['src/**/*.svelte'],
	exclude: undefined,
	compileOptions: {},
	compilations: new Map<string, SvelteUnrolledCompilation>(),
	logLevel: LogLevel.Info,
	onwarn: undefined,
	onstats: undefined,
});

const baseCompileOptions: CompileOptions = {
	format: 'esm', // If "esm", creates a JavaScript module (with import and export). If "cjs", creates a CommonJS module (with require and module.exports), which is useful in some server-side rendering situations or for testing.
	generate: 'dom', // If "dom", Svelte emits a JavaScript class for mounting to the DOM. If "ssr", Svelte emits an object with a render method suitable for server-side rendering. If false, no JavaScript or CSS is returned; just metadata.
	dev: false, // If true, causes extra code to be added to components that will perform runtime checks and provide debugging information during development.
	immutable: false, // If true, tells the compiler that you promise not to mutate any objects. This allows it to be less conservative about checking whether values have changed.
	hydratable: false, // If true, enables the hydrate: true runtime option, which allows a component to upgrade existing DOM rather than creating new DOM from scratch.
	legacy: false, // If true, generates code that will work in IE9 and IE10, which don't support things like element.dataset.
	accessors: false, // If true, getters and setters will be created for the component's props. If false, they will only be created for readonly exported values (i.e. those declared with const, class and function). If compiling with customElement: true this option defaults to true.
	customElement: false, // If true, tells the compiler to generate a custom element constructor instead of a regular Svelte component.
	tag: undefined, // A string that tells Svelte what tag name to register the custom element with. It must be a lowercase alphanumeric string with at least one hyphen, e.g. "my-element".
	css: false, // If true, styles will be included in the JavaScript class and injected at runtime. It's recommended that you set this to false and use the CSS that is statically generated, as it will result in smaller JavaScript bundles and better performance.
	preserveComments: false, // If true, your HTML comments will be preserved during server-side rendering. By default, they are stripped out.
	preserveWhitespace: false, // If true, whitespace inside and between elements is kept as you typed it, rather than optimised by Svelte.
	outputFilename: undefined, // A string used for your JavaScript sourcemap.
	cssOutputFilename: undefined, // A string used for your CSS sourcemap.
};

// TODO typescript!

export interface SvelteUnrolledPlugin extends Plugin {
	getCompilation: (id: string) => SvelteUnrolledCompilation | undefined;
}

export const name = 'svelte-unrolled';

export const svelteUnrolledPlugin = (
	pluginOptions: InitialPluginOptions,
): SvelteUnrolledPlugin => {
	const {
		dev,
		cacheCss,
		include,
		exclude,
		compileOptions,
		compilations,
		logLevel,
		onwarn,
		onstats,
	} = assignDefaults(defaultPluginOptions(pluginOptions), pluginOptions);

	const {trace, info, warn} = logger(logLevel, [magenta(`[${name}]`)]);

	const handleStats = (id: string, stats: Stats): void => {
		info(
			fmtVal('stats', toSrcPath(id)),
			...[
				fmtVal('total', fmtMs(stats.timings.total)),
				stats.timings.parse &&
					fmtVal('parse', fmtMs(stats.timings.parse.total)),
				stats.timings['create component'] &&
					fmtVal('create', fmtMs(stats.timings['create component'].total)),
			].filter(Boolean),
		);
	};

	const getCompilation = (id: string): SvelteUnrolledCompilation | undefined =>
		compilations.get(id);

	const filter = createFilter(include, exclude);

	return {
		name,
		getCompilation,
		transform(code, id) {
			if (!filter(id)) return;
			trace('transform', id);
			const svelteCompilation: SvelteCompilation = compile(code, {
				...baseCompileOptions,
				...{dev},
				...compileOptions,
				filename: id,
				name: extractFilename(id),
			});
			const {js, css, warnings, stats} = svelteCompilation;

			for (const warning of warnings) {
				if (onwarn) {
					onwarn(id, warning, warn, this);
				} else {
					warn(id, warning);
				}
			}

			if (onstats) {
				onstats(id, stats, handleStats, this);
			} else {
				handleStats(id, stats);
			}

			let cssId = replaceExt(id, '.css');
			trace('add css import', cssId);
			// TODO emit file when API is ready - https://github.com/rollup/rollup/issues/2938
			cacheCss(cssId, css);

			// save the compilation so other plugins can use it
			// TODO does the coming `emitFile` give a better way to do this?
			const compilation: SvelteUnrolledCompilation = {
				...svelteCompilation,
				id,
				cssId,
			};
			compilations.set(id, compilation);

			return js;
			// TODO why doesn't returning the ast work?
			// ideally we want this for efficiency.
			// it cannot be used if we modify the js code, like with a css import!
			// return {
			// 	...js,
			// ast: ast.instance && ast.instance.content,
			// };
		},
	};
};
