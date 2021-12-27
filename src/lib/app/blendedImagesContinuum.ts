export const computeBlendedImagesContinuumOpacities = (
	count: number,
	value: number, // `1.6` is 60% opacity of index 2 and 100% opacity of index 1
	opacities = new Array(count), // immutable by default, but can pass an array to mutate
): number[] => {
	const maxIndex = count - 1;
	const baseIndex = Math.min(maxIndex, Math.max(0, Math.floor(value)));
	const nextIndex = baseIndex === maxIndex ? null : baseIndex + 1;
	const nextIndexPct = nextIndex === null ? 0 : value % 1;
	for (let i = 0; i < count; i++) {
		opacities[i] = i === baseIndex ? 1 : i === nextIndex ? nextIndexPct : 0;
	}
	return opacities;
};
