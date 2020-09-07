<script>
	import {onMount} from 'svelte';

	import {createAutopannerStore} from '../../app/autopannerStore.js';

	// TODO choose from multiple images
	// TODO consider adjusting the duration based on distance, with a random range
	// TODO rotation?!

	export let imageUrl = '/assets/space/galaxies.jpg';
	export let imageWidth = 2560; // TODO derive from loaded image?
	export let imageHeight = 1440; // TODO derive from loaded image?
	export let width;
	export let height;
	export let scaleMin = 1;
	export let scaleMax = 4;
	export let transitionDuration = 60000;
	export let pauseDuration = 0;

	const autopanner = createAutopannerStore({
		width,
		height,
		imageWidth,
		imageHeight,
		scaleMin,
		scaleMax,
		transitionDuration,
		pauseDuration,
	});
	$: autopanner.randomize({
		width,
		height,
		imageWidth,
		imageHeight,
		scaleMin,
		scaleMax,
		transitionDuration,
		pauseDuration,
	});

	// TODO might be a better way to do this initialization
	onMount(() => autopanner.randomize(undefined, 0));
</script>

<div
	class="viewport"
	style="width: {width}px; height: {height}px;"
	on:click={() => autopanner.randomize(undefined, 1000)}
>
	<img
		src={imageUrl}
		style="width: {imageWidth}px; height: {imageHeight}px; transform: translate3d({$autopanner.x}px,
		{$autopanner.y}px, 0) scale3d({$autopanner.scale}, {$autopanner.scale}, 1); transition-duration:
		{$autopanner.lastTransitionDuration}ms;"
		alt="view of space"
	/>
</div>

<style>
	.viewport {
		overflow: hidden;
		position: relative;
	}
	:global(.idle) .viewport {
		cursor: none;
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
