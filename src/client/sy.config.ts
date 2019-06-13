import {SyConfig} from '../sy/sy';
import {classDef, classDefs, selectorDefs} from '../sy/helpers';
import {flatMap} from '../utils/arr';

// this is a side effect, but we want it to be
// tree-shook if anything from the config is imported directly
// is there a better way to do this check? meta data?
if (typeof window !== 'undefined') {
	throw Error(`sy.config.ts does not expect to be bundled!`);
}

// exported consts can be used externally, and tree-shaking kees
export const spacingCount = 10;
export const spacing = 4; // TODO what if this were a css var that can be dynamically changed for themes or user preference?
export const spacings: Array<readonly [string, number]> = [
	['1px', 1],
	['2px', 2],
	['3px', 3],
	...Array.from(
		{length: spacingCount},
		(_, i) => [String(i), i * spacing] as const,
	),
];
export const spacingsMap = new Map(spacings);
export const getSpacing = (name: string) => spacingsMap.get(name);

export const createConfig = async (
	partial: Partial<SyConfig> = {},
): Promise<SyConfig> => {
	return {
		...partial,
		// banner?(config: SyConfig): string;
		// footer?(config: SyConfig): string;
		defs: [
			// padding
			...flatMap(spacings, ([c, n]) => [
				classDef(`p-${c}`, `padding: ${n}px`),
				classDef(`pt-${c}`, `padding-top: ${n}px`),
				classDef(`pr-${c}`, `padding-right: ${n}px`),
				classDef(`pb-${c}`, `padding-bottom: ${n}px`),
				classDef(`pl-${c}`, `padding-left: ${n}px`),
			]),

			// margin
			...flatMap(spacings, ([c, n]) => [
				classDef(`m-${c}`, `margin: ${n}px`),
				classDef(`mt-${c}`, `margin-top: ${n}px`),
				classDef(`mr-${c}`, `margin-right: ${n}px`),
				classDef(`mb-${c}`, `margin-bottom: ${n}px`),
				classDef(`ml-${c}`, `margin-left: ${n}px`),
			]),

			// width
			...spacings.map(([c, n]) => classDef(`w-${c}`, `width: ${n}px`)),

			// height
			...spacings.map(([c, n]) => classDef(`h-${c}`, `height: ${n}px`)),

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
				h1: `font-size: 55px; margin: 0 0 ${getSpacing('7')}px`, // TODO class composition? {classes: ['m-0', 'mb-2']}
			}),
		],
	};
};
