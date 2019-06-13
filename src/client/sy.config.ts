import {SyConfig, SyClassDefs} from '../sy/sy';
import {GR} from '../utils/math';

export const spacingCount = 10;
const spacing1 = 3;
const spacings = Array.from({length: spacingCount}, (_, i) =>
	i === 0 ? 0 : i === 1 ? 1 : Math.round(spacing1 * Math.pow(GR, i - 2)),
);

export const createConfig = async (
	partial: Partial<SyConfig> = {},
): Promise<SyConfig> => {
	return {
		...partial,
		// dev?: boolean;
		// banner?(config: SyConfig): string;
		// footer?(config: SyConfig): string;
		classes: {
			block: 'display: block;',
			flex: {
				css: 'display: flex',
			},

			// padding
			...spacings.reduce(
				(r, s, i) => ((r[`p-${i}`] = `padding: ${s}px`), r),
				{} as SyClassDefs,
			),

			// margin
			...spacings.reduce(
				(r, s, i) => ((r[`m-${i}`] = `margin: ${s}px`), r),
				{} as SyClassDefs,
			),

			// width
			...spacings.reduce(
				(r, s, i) => ((r[`w-${i}`] = `width: ${s}px`), r),
				{} as SyClassDefs,
			),

			// height
			...spacings.reduce(
				(r, s, i) => ((r[`h-${i}`] = `height: ${s}px`), r),
				{} as SyClassDefs,
			),
		},
	};
};
