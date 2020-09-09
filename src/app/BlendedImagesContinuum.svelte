<script>
	import {computeBlendedImagesContinuumOpacities} from './blendedImagesContinuum.js';

	export let images;
	export let value; // `1.6` is 60% opacity of index 2 and 100% opacity of index 1
	export let alt;

	$: opacities = computeBlendedImagesContinuumOpacities(images.length, value);
</script>

{#each images as image, i (image)}
	<img src={image} {alt} style="opacity: {opacities[i]}; z-index: 3;" />
{/each}

<style>
	img {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
	}
</style>
