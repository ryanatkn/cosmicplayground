<script>
	import {onMount, onDestroy} from 'svelte';
	import {randomFloat} from '@feltcoop/gro/dist/utils/random.js';

	// TODO choose from multiple images
	// TODO consider adjusting the duration based on distance, with a random range
	// TODO rotation?!

	export let imageUrl = '/assets/space/galaxies.jpg';
	export let width;
	export let height;
	export let scaleMin = 1;
	export let scaleMax = 4;
	export let transitionDuration = 60000;
	export let pauseDuration = 2000;

	let timeout;

	let imageWidth = 2560; // TODO derive from loaded image
	let imageHeight = 1440; // TODO derive from loaded image
	let x = 0;
	let y = 0;
	let scale = 1;

	const randomize = (duration = transitionDuration + pauseDuration) => {
		// TODO maybe change the duration based on the distance/scaling to be done?
		// or maybe ensure either/both the scaling/distance factor are significantly different?
		scale = randomFloat(scaleMin, scaleMax);
		const scaledImageWidth = imageWidth * scale;
		const scaledImageHeight = imageHeight * scale;
		const xMin = 0;
		const yMin = 0;
		const xMax = scaledImageWidth - width;
		const yMax = scaledImageHeight - height;
		x = -randomFloat(xMin, xMax);
		y = -randomFloat(yMin, yMax);

		// allow `randomize` to be called during a transition
		clearTimeout(timeout);
		timeout = setTimeout(() => randomize(), duration);
	};

	onMount(() => randomize(0));
	onDestroy(() => clearTimeout(timeout));
</script>

<div class="viewport" style="width: {width}px; height: {height}px;" on:click={() => randomize()}>
	<img
		src={imageUrl}
		style="width: {imageWidth}px; height: {imageHeight}px; transform: translate3d({x}px, {y}px, 0)
		scale3d({scale}, {scale}, 1); transition-duration: {transitionDuration}ms;"
		alt="view of space"
	/>
</div>

<style>
	.viewport {
		overflow: hidden;
		position: relative;
	}
	img {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
		transition-property: transform;
		transition-timing-function: ease-in-out;
		transform-origin: top left;
		/* fixes a bug in Chrome where sections of the image go black until the mouse is moved */
		will-change: transform;
	}
</style>
