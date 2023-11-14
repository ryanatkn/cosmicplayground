<script lang="ts">
	import {computeBlendedImagesContinuumOpacities} from '$lib/app/blendedImagesContinuum';

	export let images: string[];
	export let value: number; // `1.6` is 60% opacity of index 2 and 100% opacity of index 1
	export let alt: string;
	export let zIndex = 1;
	export let floorIndex: number | undefined = undefined;

	// TODO don't create new opacities every tick, but need to disable immutable? (or swap?)
	$: opacities = computeBlendedImagesContinuumOpacities(
		images.length,
		value,
		undefined,
		floorIndex,
	);
</script>

{#each images as image, i (image)}
	<img
		src={image}
		{alt}
		style="opacity: {opacities[i]}; z-index: {floorIndex === undefined
			? zIndex
			: i === floorIndex
			  ? zIndex
			  : zIndex + 1};"
	/>
{/each}

<style>
	img {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
	}
</style>
