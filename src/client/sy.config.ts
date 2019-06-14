import {SyConfig} from '../sy/sy';
import {classDef, classDefs, selectorDef, selectorDefs} from '../sy/helpers';
import {arrayOf, flatMap} from '../utils/arr';

// this is a side effect, but we want it to be
// tree-shook if anything from the config is imported directly
// is there a better way to do this check? meta data?
if (typeof window !== 'undefined') {
	throw Error(`sy.config.ts does not expect to be bundled!`);
}

// generic css-related utils
// the type of `getVar` is ridiculous but I'm just having fun here :d
const getVar = <T extends (...args: any) => any>(getProperty: T) => (
	...args: Parameters<T>
): string => `var(${getProperty.apply(null, args)})`;

// exported consts can be used externally, at buildtime or runtime,
// and tree-shaking keeps the bundle happy
export const spacingCount = 10;
export const spacing = 4;
export const spacings = arrayOf(spacingCount);
export type SpacingPropertyName = '1px' | '2px' | '3px' | number; // in an ideal world, `number` would be a union of numbers to prevent misuse, but that's a level of hackery I don't want to stoop to yet - maybe codegen types from `spacingCount`? lol
export const getSpacingProperty = (name?: SpacingPropertyName): string =>
	name === undefined ? `--spacing` : `--spacing-${name}`;
export const getSpacingVar = getVar(getSpacingProperty);

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
					`${getSpacingProperty()}: ${spacing}px`,
					`${getSpacingProperty('1px')}: 1px`,
					`${getSpacingProperty('2px')}: 2px`,
					`${getSpacingProperty('3px')}: 3px`,
					...spacings.map(
						i => `${getSpacingProperty(i)}: calc(${i} * ${getSpacingVar()})`,
					),
				].join(';'),
			),

			// padding
			...flatMap(spacings, i => [
				classDef(`p-${i}`, `padding: ${getSpacingVar(i)}`),
				classDef(`pt-${i}`, `padding-top: ${getSpacingVar(i)}`),
				classDef(`pr-${i}`, `padding-right: ${getSpacingVar(i)}`),
				classDef(`pb-${i}`, `padding-bottom: ${getSpacingVar(i)}`),
				classDef(`pl-${i}`, `padding-left: ${getSpacingVar(i)}`),
			]),

			// margin
			...flatMap(spacings, i => [
				classDef(`m-${i}`, `margin: ${getSpacingVar(i)}`),
				classDef(`mt-${i}`, `margin-top: ${getSpacingVar(i)}`),
				classDef(`mr-${i}`, `margin-right: ${getSpacingVar(i)}`),
				classDef(`mb-${i}`, `margin-bottom: ${getSpacingVar(i)}`),
				classDef(`ml-${i}`, `margin-left: ${getSpacingVar(i)}`),
			]),

			// width
			...spacings.map(i => classDef(`w-${i}`, `width: ${getSpacingVar(i)}`)),

			// height
			...spacings.map(i => classDef(`h-${i}`, `height: ${getSpacingVar(i)}`)),

			...classDefs({
				// display
				block: 'display: block;',
				flex: 'display: flex',

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

			// h1 (TODO through h6)
			...selectorDefs({
				h1: `font-size: 55px; margin: 0 0 ${getSpacingVar(7)}`, // TODO class composition? {classes: ['m-0', 'mb-2']}
			}),
		],
	};
};
