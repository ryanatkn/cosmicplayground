export const computeBlendedImagesCycleOpacities = (
	count: number,
	value: number, // float, where `0 <= value < images.length`
	opacities = new Array(count), // immutable by default, but can pass an array to mutate
): number[] => {
	const baseIndex = Math.floor(value);
	const nextIndex = baseIndex === count - 1 ? 0 : baseIndex + 1;
	const nextIndexPct = value - baseIndex;
	for (let i = 0; i < count; i++) {
		let opacity = 0;
		if (i === baseIndex) {
			opacity = 1;
		} else if (i === nextIndex) {
			opacity = nextIndexPct;
		}
		opacities[i] = opacity;
	}
	return opacities;
};

export const computeBlendedImagesCycleZIndex = (
	count: number,
	index: number,
	opacity: number,
): number => index + count * (opacity === 1 && index === count - 1 ? 1 : 2);
