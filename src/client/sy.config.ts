import {SyConfig} from '../sy/sy';
import {
	classDef,
	classDefs,
	selectorDef,
	selectorDefs,
	propsToClassDefs,
} from '../sy/helpers';
import {arrayOf} from '../utils/arr';
import {blendModes} from '../css/blendModes';
import {
	cursor,
	justifyContent,
	alignItems,
	textDecorationStyle,
	textDecoration,
	fontWeight,
	display,
	position,
	flex,
	overflow,
	textAlign,
	flexWrap,
} from '../css/properties';

// TODO the error messages from malformed css declarations are gnarly af
// TODO l-0 and t-0 should compile without a `var(--spacing-0)`, just be 0
// TODO consider removing the `-` from a lot of things, especially things ending in numbers like mx-2 and t-0

// helper for tagging dynamic css class usage so `sy` sees it for inclusion.
// see `classFnMatcher` in `rollup-plugin-svelte-extract-css-classes`.
export const cls = (cssClasses: string): string => cssClasses; // TODO consider accepting multiple params and joining? is that a valid use case? we'll know when/if we get there

// generic css-related utils
const toVarName = <T>(prefix: string) => (suffix?: T): string =>
	suffix === undefined ? `--${prefix}` : `--${prefix}-${suffix}`;
// the type of `toVar` is ridiculous but I'm just having fun here :d
const toVar = <T extends (...args: any) => any>(getProperty: T) => (
	...args: Parameters<T>
): string => `var(${getProperty.apply(null, args)})`;

// exported consts can be used externally, at buildtime or runtime,
// and tree-shaking keeps the bundle happy
export const spacing = 4;
export const spacings = arrayOf(17).concat(
	18, 20, 22, 24, 25, 26, 28, 30, 32, 36, 40,
	50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200
); // prettier-ignore
export type SpacingVarName = '1px' | '2px' | '3px' | number; // in an ideal world, `number` would be a union of numbers to prevent misuse, but that's a level of hackery I don't want to stoop to yet - maybe codegen types from `spacingCount`? lol
export const spacingProperty = toVarName<SpacingVarName>('spacing');
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
						s => `${spacingProperty(s)}: calc(${s} * ${spacingVar()})`,
					),
				].join(';'),
			),

			// padding
			...spacings.flatMap(s => [
				classDef(`p-${s}`, `padding: ${spacingVar(s)}`),
				classDef(`pt-${s}`, `padding-top: ${spacingVar(s)}`),
				classDef(`pr-${s}`, `padding-right: ${spacingVar(s)}`),
				classDef(`pb-${s}`, `padding-bottom: ${spacingVar(s)}`),
				classDef(`pl-${s}`, `padding-left: ${spacingVar(s)}`),
				classDef(
					`px-${s}`,
					`padding-left: ${spacingVar(s)}; padding-right: ${spacingVar(s)}`,
				), // TODO consider a class composition pattern
				classDef(
					`py-${s}`,
					`padding-top: ${spacingVar(s)}; padding-bottom: ${spacingVar(s)}`,
				), // TODO consider a class composition pattern
			]),

			// margin
			...spacings.flatMap(s => [
				classDef(`m-${s}`, `margin: ${spacingVar(s)}`),
				classDef(`mt-${s}`, `margin-top: ${spacingVar(s)}`),
				classDef(`mr-${s}`, `margin-right: ${spacingVar(s)}`),
				classDef(`mb-${s}`, `margin-bottom: ${spacingVar(s)}`),
				classDef(`ml-${s}`, `margin-left: ${spacingVar(s)}`),
				classDef(
					`mx-${s}`,
					`margin-left: ${spacingVar(s)}; margin-right: ${spacingVar(s)}`,
				), // TODO consider a class composition pattern
				classDef(
					`my-${s}`,
					`margin-top: ${spacingVar(s)}; margin-bottom: ${spacingVar(s)}`,
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
			...spacings.map(s => classDef(`w-${s}`, `width: ${spacingVar(s)}`)),
			classDef('w-full', 'width: 100%'),
			classDef('w-auto', 'width: auto'),
			classDef('max-width-none', 'max-width: none'),
			classDef('max-column-width', 'max-width: 980px'), // TODO refactor? rename?

			// height
			...spacings.map(s => classDef(`h-${s}`, `height: ${spacingVar(s)}`)),
			classDef('h-full', 'height: 100%'),
			classDef('h-auto', 'height: auto'),

			// left/right/top/bottom
			...spacings.map(s => classDef(`l-${s}`, `left: ${spacingVar(s)}`)),
			...spacings.map(s => classDef(`r-${s}`, `right: ${spacingVar(s)}`)),
			...spacings.map(s => classDef(`t-${s}`, `top: ${spacingVar(s)}`)),
			...spacings.map(s => classDef(`b-${s}`, `bottom: ${spacingVar(s)}`)),
			...spacings.map(s =>
				classDef(`-l-${s}`, `left: calc(-1 * ${spacingVar(s)})`),
			),
			...spacings.map(s =>
				classDef(`-r-${s}`, `right: calc(-1 * ${spacingVar(s)})`),
			),
			...spacings.map(s =>
				classDef(`-t-${s}`, `top: calc(-1 * ${spacingVar(s)})`),
			),
			...spacings.map(s =>
				classDef(`-b-${s}`, `bottom: calc(-1 * ${spacingVar(s)})`),
			),

			// position
			...propsToClassDefs(position, 'position', ''),
			...classDefs({
				// TODO other values? might want a better design - needed for e.g. padding.
				absolute0: 'position: absolute; left: 0; top: 0;',
			}),

			// display
			...propsToClassDefs(display, 'display', ''),

			// overflow
			...propsToClassDefs(overflow, 'overflow'),
			...propsToClassDefs(overflow, 'overflow-x'),
			...propsToClassDefs(overflow, 'overflow-y'),

			// text-align
			...propsToClassDefs(textAlign, 'text-align', 'text'),

			// z-index
			...arrayOf(10, n => classDef(`z-${n}`, `z-index: ${n}`)),
			...arrayOf(3, n => classDef(`-z-${n + 1}`, `z-index: -${n + 1}`)),

			// font-weight
			...propsToClassDefs(fontWeight, 'font-weight', 'font'),

			// font-size
			classDef('text-xs', 'font-size: .75rem'),
			classDef('text-sm', 'font-size: .875rem'),
			classDef('text-base', 'font-size: 1rem'),
			classDef('text-lg', 'font-size: 1.125rem'),
			classDef('text-xl', 'font-size: 1.25rem'),
			classDef('text-2xl', 'font-size: 1.5rem'),
			classDef('text-3xl', 'font-size: 1.875rem'),
			classDef('text-4xl', 'font-size: 2.25rem'),
			classDef('text-5xl', 'font-size: 3rem'),
			classDef('text-6xl', 'font-size: 4rem'),

			// text-decoration
			...propsToClassDefs(textDecoration, 'text-decoration', ''),
			...propsToClassDefs(
				textDecorationStyle,
				'text-decoration-style',
				'text-decoration',
			),

			// flexbox
			...propsToClassDefs(flex, 'flex'),
			...propsToClassDefs(justifyContent, 'justify-content', 'justify'),
			...propsToClassDefs(alignItems, 'align-items', 'items'),
			...propsToClassDefs(flexWrap, 'flex-wrap', 'flex'),
			...classDefs({
				// TODO col shorthand is the problem here ..
				// splitting the flexDirectionRow/Col definitions works but that's gross
				// hmm.. this strategy isn't the easiest to read in general,
				// but it _is_ flexible, easy to alter prefixes and such
				'flex-row': 'flex-direction: row',
				'flex-row-reverse': 'flex-direction: row-reverse',
				'flex-col': 'flex-direction: column',
				'flex-col-reverse': 'flex-direction: column-reverse',
			}),

			// cursors
			...propsToClassDefs(cursor, 'cursor'),

			// blend modeas
			...blendModes.flatMap(b => [
				classDef(`bg-blend-${b}`, `background-blend-mode: ${b}`),
				classDef(`mix-blend-${b}`, `mix-blend-mode: ${b}`),
			]),

			// h1 (TODO through h6)
			...selectorDefs({
				h1: `font-size: 55px; margin: 0 0 ${spacingVar(7)}`, // TODO class composition? {classes: ['m-0', 'mb-2']}
			}),

			// colors
			classDef('color-primary', 'color: #fff'), // TODO shouldn't primary be the default? dark vs light bgs?

			// bg colors
			classDef('bg-transparent', 'background-color: transparent'), // TODO shouldn't primary be the default? dark vs light bgs?

			// borders
			classDef('border-primary', 'border: 1px solid #fff'), // TODO shouldn't primary be the default? dark vs light bgs?
			classDef('border-accent', 'border: 1px solid #47c'),
			classDef('border', 'border-width: 1px'),
			classDef('border-0', 'border-width: 0'),
			classDef('border-2', 'border-width: 2px'),
			classDef('border-4', 'border-width: 4px'),
			classDef('border-8', 'border-width: 8px'),
			classDef('border-t', 'border-top-width: 1px'),
			classDef('border-r', 'border-right-width: 1px'),
			classDef('border-b', 'border-bottom-width: 1px'),
			classDef('border-l', 'border-left-width: 1px'),
			classDef('border-t-0', 'border-top-width: 0'),
			classDef('border-r-0', 'border-right-width: 0'),
			classDef('border-b-0', 'border-bottom-width: 0'),
			classDef('border-l-0', 'border-left-width: 0'),
			classDef('border-t-2', 'border-top-width: 2px'),
			classDef('border-r-2', 'border-right-width: 2px'),
			classDef('border-b-2', 'border-bottom-width: 2px'),
			classDef('border-l-2', 'border-left-width: 2px'),
			classDef('border-t-4', 'border-top-width: 4px'),
			classDef('border-r-4', 'border-right-width: 4px'),
			classDef('border-b-4', 'border-bottom-width: 4px'),
			classDef('border-l-4', 'border-left-width: 4px'),
			classDef('border-t-8', 'border-top-width: 8px'),
			classDef('border-r-8', 'border-right-width: 8px'),
			classDef('border-b-8', 'border-bottom-width: 8px'),
			classDef('border-l-8', 'border-left-width: 8px'),
		],
	};
};
