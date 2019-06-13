import {SyConfig, SyClassDefs} from '../sy/sy';

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

export const createConfig = async (
	partial: Partial<SyConfig> = {},
): Promise<SyConfig> => {
	return {
		...partial,
		// dev?: boolean;
		// banner?(config: SyConfig): string;
		// footer?(config: SyConfig): string;
		classes: {
			// display
			block: 'display: block;',
			flex: {
				// TODO other options?
				css: 'display: flex',
			},

			// flexbox
			'flex-auto': 'flex: auto',
			'flex-initial': 'flex: initial',
			'flex-none': 'flex: none',
			'flex-1': 'flex: 1',

			'flex-row': 'flex-direction: row',
			'flex-row-reverse': 'flex-direction: row-reverse',
			'flex-col': 'flex-direction: column',
			'flex-col-reverse': 'flex-direction: column-reverse',

			// padding
			...spacings.reduce(
				(r, [c, n]) => {
					r[`p-${c}`] = `padding: ${n}px`;
					r[`pt-${c}`] = `padding-top: ${n}px`;
					r[`pr-${c}`] = `padding-right: ${n}px`;
					r[`pb-${c}`] = `padding-bottom: ${n}px`;
					r[`pl-${c}`] = `padding-left: ${n}px`;
					return r;
				},
				{} as SyClassDefs,
			),

			// margin
			...spacings.reduce(
				(r, [c, n]) => {
					r[`m-${c}`] = `margin: ${n}px`;
					r[`mt-${c}`] = `margin-top: ${n}px`;
					r[`mr-${c}`] = `margin-right: ${n}px`;
					r[`mb-${c}`] = `margin-bottom: ${n}px`;
					r[`ml-${c}`] = `margin-left: ${n}px`;
					return r;
				},
				{} as SyClassDefs,
			),

			// width
			...spacings.reduce(
				(r, [c, n]) => ((r[`w-${c}`] = `width: ${n}px`), r),
				{} as SyClassDefs,
			),

			// height
			...spacings.reduce(
				(r, [c, n]) => ((r[`h-${c}`] = `height: ${n}px`), r),
				{} as SyClassDefs,
			),
		},
	};
};
