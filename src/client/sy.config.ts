import {SyConfig} from '../sy/sy';
import {classDef, classDefs, selectorDef, selectorDefs} from '../sy/helpers';
import {arrayOf, flatMap} from '../utils/arr';
import {blendModes} from '../css/blendModes';

// helper for tagging dynamic css class usage so `sy` sees it for inclusion.
// see `classFnMatcher` in `rollup-plugin-svelte-extract-css-classes`.
export const cls = (cssClasses: string): string => cssClasses; // TODO consider accepting multiple params and joining? is that a valid use case? we'll know when/if we get there

// generic css-related utils
const toProperty = <T>(prefix: string) => (suffix?: T): string =>
	suffix === undefined ? `--${prefix}` : `--${prefix}-${suffix}`;
// the type of `toVar` is ridiculous but I'm just having fun here :d
const toVar = <T extends (...args: any) => any>(getProperty: T) => (
	...args: Parameters<T>
): string => `var(${getProperty.apply(null, args)})`;

// exported consts can be used externally, at buildtime or runtime,
// and tree-shaking keeps the bundle happy
export const spacingCount = 32; // TODO maybe cut out some of the higher numbers here, what is 31 good for? anything, nothing?
export const spacing = 4;
export const spacings = arrayOf(spacingCount); // TODO why does rollup always bundle this along with `spacingCount` and `arrayOf`?
export type SpacingPropertyName = '1px' | '2px' | '3px' | number; // in an ideal world, `number` would be a union of numbers to prevent misuse, but that's a level of hackery I don't want to stoop to yet - maybe codegen types from `spacingCount`? lol
export const spacingProperty = toProperty<SpacingPropertyName>('spacing');
export const spacingVar = toVar(spacingProperty);

// TODO malformed CSS causes some gnarly errors - maybe use `magic-string` to make a sourcemap?

export const createConfig = async (
	partial: Partial<SyConfig> = {},
): Promise<SyConfig> => {
	return {
		...partial,
		// banner?(config: SyConfig): string;
		// footer?(config: SyConfig): string;
		defs: [
			// vars
			selectorDef(
				':root',
				[
					// TODO could abstract out all of the spacing names for reuse
					`${spacingProperty()}: ${spacing}px`,
					`${spacingProperty('1px')}: 1px`,
					`${spacingProperty('2px')}: 2px`,
					`${spacingProperty('3px')}: 3px`,
					...spacings.map(
						i => `${spacingProperty(i)}: calc(${i} * ${spacingVar()})`,
					),
				].join(';'),
			),

			// padding
			...flatMap(spacings, i => [
				classDef(`p-${i}`, `padding: ${spacingVar(i)}`),
				classDef(`pt-${i}`, `padding-top: ${spacingVar(i)}`),
				classDef(`pr-${i}`, `padding-right: ${spacingVar(i)}`),
				classDef(`pb-${i}`, `padding-bottom: ${spacingVar(i)}`),
				classDef(`pl-${i}`, `padding-left: ${spacingVar(i)}`),
				classDef(
					`px-${i}`,
					`padding-left: ${spacingVar(i)}; padding-right: ${spacingVar(i)}`,
				), // TODO consider a class composition pattern
				classDef(
					`py-${i}`,
					`padding-top: ${spacingVar(i)}; padding-bottom: ${spacingVar(i)}`,
				), // TODO consider a class composition pattern
			]),

			// margin
			...flatMap(spacings, i => [
				classDef(`m-${i}`, `margin: ${spacingVar(i)}`),
				classDef(`mt-${i}`, `margin-top: ${spacingVar(i)}`),
				classDef(`mr-${i}`, `margin-right: ${spacingVar(i)}`),
				classDef(`mb-${i}`, `margin-bottom: ${spacingVar(i)}`),
				classDef(`ml-${i}`, `margin-left: ${spacingVar(i)}`),
				classDef(
					`mx-${i}`,
					`margin-left: ${spacingVar(i)}; margin-right: ${spacingVar(i)}`,
				), // TODO consider a class composition pattern
				classDef(
					`my-${i}`,
					`margin-top: ${spacingVar(i)}; margin-bottom: ${spacingVar(i)}`,
				), // TODO consider a class composition pattern
			]),
			classDef('m-auto', 'margin: auto'),
			classDef(`mt-auto`, `margin-top: auto`),
			classDef(`mr-auto`, `margin-right: auto`),
			classDef(`mb-auto`, `margin-bottom: auto`),
			classDef(`ml-auto`, `margin-left: auto`),
			classDef(`mx-auto`, `margin-left: auto; margin-right: auto`), // TODO consider a class composition pattern
			classDef(`my-auto`, `margin-top: auto; margin-bottom: auto`), // TODO consider a class composition pattern

			// width
			...spacings.map(i => classDef(`w-${i}`, `width: ${spacingVar(i)}`)),
			classDef('w-100', 'width: 100%'), // TODO hmm..this is a little ambiguous but I don't foresee ever using 100 spacings

			// height
			...spacings.map(i => classDef(`h-${i}`, `height: ${spacingVar(i)}`)),
			classDef('h-100', 'height: 100%'), // TODO hmm..this is a little ambiguous but I don't foresee ever using 100 spacings

			// TODO flatten/combine usage of `classDefs`? review the high level layout pattern of all of these styles
			...classDefs({
				// display
				block: 'display: block',
				flex: 'display: flex',
				inline: 'display: inline',
				'inline-block': 'display: inline-block',

				// position
				static: 'position: static',
				relative: 'position: relative',
				absolute: 'position: absolute',
				fixed: 'position: fixed',
				sticky: 'position: sticky',
				absolute0: 'position: absolute; left: 0; top: 0;', // TODO other values? might want a better design - needed for e.g. padding.
				// TODO add left/right/top/bottom spacings

				// flexbox
				'flex-auto': 'flex: auto',
				'flex-initial': 'flex: initial',
				'flex-none': 'flex: none',
				'flex-1': 'flex: 1',

				'flex-row': 'flex-direction: row',
				'flex-row-reverse': 'flex-direction: row-reverse',
				'flex-col': 'flex-direction: column',
				'flex-col-reverse': 'flex-direction: column-reverse',

				// justify content values have sketchy support - Edge support in particular is weak
				// https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
				// 'justify-start': 'justify-content: start',
				// 'justify-end': 'justify-content: end',
				'justify-start': 'justify-content: flex-start',
				'justify-end': 'justify-content: flex-end',
				'justify-center': 'justify-content: center',
				// 'justify-left': 'justify-content: left',
				// 'justify-right': 'justify-content: right',
				'justify-normal': 'justify-content: normal',
				// 'justify-baseline': 'justify-content: baseline',
				// 'justify-first-baseline': 'justify-content: first-baseline',
				// 'justify-last-baseline': 'justify-content: last-baseline',
				'justify-between': 'justify-content: space-between',
				'justify-around': 'justify-content: space-around',
				// 'justify-evenly': 'justify-content: space-evenly',
				// 'justify-stretch': 'justify-content: stretch', // hmm........ this may be the one that gets me to break some browsers

				// align items
				// TODO some of the support for these may be incorrect on MDN
				// https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
				'items-normal': 'align-items: normal',
				'items-start': 'align-items: flex-start',
				'items-end': 'align-items: flex-end',
				'items-center': 'align-items: center',
				// 'items-start':'align-items: start',
				// 'items-end':'align-items: end',
				'items-self-start': 'align-items: self-start',
				'items-self-end': 'align-items: self-end',
				'items-baseline': 'align-items: baseline',
				// 'items-first-baseline':'align-items: first baseline',
				// 'items-last-baseline':'align-items: last baseline',
				'items-stretch': 'align-items: stretch',
				// 'items-safe':'align-items: safe',
				// 'items-unsafe':'align-items: unsafe',

				// font-weight
				// TODO consider supporting numerical weight?
				// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
				'font-normal': 'font-weight: normal',
				'font-bold': 'font-weight: bold',
				'font-lighter': 'font-weight: lighter',
				'font-bolder': 'font-weight: bolder',

				// text-decoration
				// TODO text-decoration-color
				// TODO b/c of Edge, using plain "text-decoration" instead of "text-decoration-line"
				// https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line
				'text-decoration-none': 'text-decoration: none',
				underline: 'text-decoration: underline',
				overline: 'text-decoration: overline',
				'line-through': 'text-decoration: line-through',
				'text-decoration-solid': 'text-decoration-style: solid',
				'text-decoration-double': 'text-decoration-style: double',
				'text-decoration-dotted': 'text-decoration-style: dotted',
				'text-decoration-dashed': 'text-decoration-style: dashed',
				'text-decoration-wavy': 'text-decoration-style: wavy',

				// cursors
				'cursor-auto': 'cursor: auto',
				'cursor-default': 'cursor: default',
				'cursor-none': 'cursor: none',
				'cursor-context-menu': 'cursor: context-menu',
				'cursor-help': 'cursor: help',
				'cursor-pointer': 'cursor: pointer',
				'cursor-progress': 'cursor: progress',
				'cursor-wait': 'cursor: wait',
				'cursor-cell': 'cursor: cell',
				'cursor-crosshair': 'cursor: crosshair',
				'cursor-text': 'cursor: text',
				'cursor-vertical-text': 'cursor: vertical-text',
				'cursor-alias': 'cursor: alias',
				'cursor-copy': 'cursor: copy',
				'cursor-move': 'cursor: move',
				'cursor-no-drop': 'cursor: no-drop',
				'cursor-not-allowed': 'cursor: not-allowed',
				'cursor-grab': 'cursor: grab',
				'cursor-grabbing': 'cursor: grabbing',
				'cursor-e-resize': 'cursor: e-resize',
				'cursor-n-resize': 'cursor: n-resize',
				'cursor-ne-resize': 'cursor: ne-resize',
				'cursor-nw-resize': 'cursor: nw-resize',
				'cursor-s-resize': 'cursor: s-resize',
				'cursor-se-resize': 'cursor: se-resize',
				'cursor-sw-resize': 'cursor: sw-resize',
				'cursor-w-resize': 'cursor: w-resize',
				'cursor-ew-resize': 'cursor: ew-resize',
				'cursor-ns-resize': 'cursor: ns-resize',
				'cursor-nesw-resize': 'cursor: nesw-resize',
				'cursor-nwse-resize': 'cursor: nwse-resize',
				'cursor-col-resize': 'cursor: col-resize',
				'cursor-row-resize': 'cursor: row-resize',
				'cursor-all-scroll': 'cursor: all-scroll',
				'cursor-zoom-in': 'cursor: zoom-in',
				'cursor-zoom-out': 'cursor: zoom-out',
			}),

			// blend modeas
			...flatMap(blendModes, b => [
				classDef(`bg-blend-${b}`, `background-blend-mode: ${b}`),
				classDef(`mix-blend-${b}`, `mix-blend-mode: ${b}`),
			]),

			// h1 (TODO through h6)
			...selectorDefs({
				h1: `font-size: 55px; margin: 0 0 ${spacingVar(7)}`, // TODO class composition? {classes: ['m-0', 'mb-2']}
				img: `vertical-align: top`, // TODO consider just making them blocks; line-blocks are so weird
			}),
		],
	};
};
