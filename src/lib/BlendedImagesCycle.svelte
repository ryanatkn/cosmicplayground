<script lang="ts">
	import {
		computeBlendedImagesCycleOpacities,
		computeBlendedImagesCycleZIndex,
	} from '$lib/blendedImagesCycle.js';

	interface Props {
		images: string[];
		value: number; // float, where `0 <= value < images.length`
		alt: string;
	}

	let {images, value, alt}: Props = $props();

	let opacities = $derived(computeBlendedImagesCycleOpacities(images.length, value));
</script>

{#each images as image, i (image)}
	<img
		src={image}
		{alt}
		style:opacity={opacities[i]}
		style:z-index={computeBlendedImagesCycleZIndex(images.length, i, opacities[i])}
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
