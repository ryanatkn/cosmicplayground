<script>
	import {
		computeBlendedImagesCycleOpacities,
		computeBlendedImagesCycleZIndex,
	} from './blendedImagesCycle.js';

	export let images;
	export let value; // float, where `0 <= value < images.length`
	export let alt;

	$: opacities = computeBlendedImagesCycleOpacities(images.length, value);
</script>

{#each images as image, i (image)}
	<img
		src={image}
		{alt}
		style="opacity: {opacities[i]}; z-index: {computeBlendedImagesCycleZIndex(images.length, i, opacities[i])};"
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
