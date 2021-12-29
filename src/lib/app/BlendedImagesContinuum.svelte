<script lang="ts">
	import {computeBlendedImagesContinuumOpacities} from '$lib/app/blendedImagesContinuum';

	export let images: string[];
	export let value: number; // `1.6` is 60% opacity of index 2 and 100% opacity of index 1
	export let alt: string;
	export let zIndex = 1;

	$: opacities = computeBlendedImagesContinuumOpacities(images.length, value);
</script>

{#each images as image, i (image)}
	<img src={image} {alt} style="opacity: {opacities[i]}; z-index: {zIndex};" />
{/each}

<style>
	img {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
	}
</style>
