<script lang="ts">
	import {computeBlendedImagesContinuumOpacities} from '$lib/blendedImagesContinuum.js';

	interface Props {
		images: string[];
		value: number; // `1.6` is 60% opacity of index 2 and 100% opacity of index 1
		alt: string;
		zIndex?: number;
		floorIndex?: number | undefined;
	}

	let {images, value, alt, zIndex = 1, floorIndex = undefined}: Props = $props();

	// TODO don't create new opacities every tick, but need to disable immutable? (or swap?)
	let opacities = $derived(
		computeBlendedImagesContinuumOpacities(images.length, value, undefined, floorIndex),
	);
</script>

{#each images as image, i (image)}
	<img
		src={image}
		{alt}
		style:opacity={opacities[i]}
		style:z-index={floorIndex === undefined ? zIndex : i === floorIndex ? zIndex : zIndex + 1}
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
