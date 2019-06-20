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

			// TODO flatten/combine usage of `classDefs`? review the high level layout pattern of all of these styles
			...classDefs({
				// display
				block: 'display: block;',
				flex: 'display: flex',
				inline: 'display: inline',
				'inline-block': 'display: inline-block',

				// position
				static: 'position: static',
				relative: 'position: relative',
				absolute: 'position: absolute',
				fixed: 'position: fixed',
				sticky: 'position: sticky',

				// flexbox
				'flex-auto': 'flex: auto',
				'flex-initial': 'flex: initial',
				'flex-none': 'flex: none',
				'flex-1': 'flex: 1',

				'flex-row': 'flex-direction: row',
				'flex-row-reverse': 'flex-direction: row-reverse',
				'flex-col': 'flex-direction: column',
				'flex-col-reverse': 'flex-direction: column-reverse',
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
