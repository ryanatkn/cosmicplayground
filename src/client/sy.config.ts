import {SyConfig} from '../sy/sy';
import {
	classDef,
	classDefs,
	selectorDef,
	selectorDefs,
	propsToClassDefs,
} from '../sy/helpers';
import {arrayOf, flatMap} from '../utils/arr';
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
} from '../css/properties';

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
export const spacings = arrayOf(16).concat(
	20, 24, 28, 32, 36, 40, 48, 64, 96, 128
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

			// TODO add left/right/top/bottom spacings

			// position
			...propsToClassDefs(position, 'position', ''),
			...classDefs({
				// TODO other values? might want a better design - needed for e.g. padding.
				absolute0: 'position: absolute; left: 0; top: 0;',
			}),

			// display
			...propsToClassDefs(display, 'display', ''),

			// font-weight
			...propsToClassDefs(fontWeight, 'font-weight', 'font'),

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
			...flatMap(blendModes, b => [
				classDef(`bg-blend-${b}`, `background-blend-mode: ${b}`),
				classDef(`mix-blend-${b}`, `mix-blend-mode: ${b}`),
			]),

			// h1 (TODO through h6)
			...selectorDefs({
				h1: `font-size: 55px; margin: 0 0 ${spacingVar(7)}`, // TODO class composition? {classes: ['m-0', 'mb-2']}
				img: `vertical-align: middle`, // TODO consider just making them blocks; line-blocks are so weird
			}),
		],
	};
};
