<script>
	import ImageViewer from '../../app/ImageViewer.svelte';
	import BlendedImagesCycle from '../../app/BlendedImagesCycle.svelte';
	import BlendedImagesContinuum from '../../app/BlendedImagesContinuum.svelte';

	/*

	This is the original implementation of the renderer for the animated Earth sea levels.
	Using the normal DOM `<img>` ended up being slow and wasteful
	compared to using WebGL, so we introduced pixi.js as a dependency to handle rendering.
	See `./EarthViewerPixi.svelte` for that implementation.
	This DOM version remains for posterity,
	and it may be interesting to see how its performance compares on various devices and browsers.
	On my machine, Firefox can render this and drop about 10% of frames,
	while Chrome and Edge get severe framerate issues
	seemingly because they're shy about using more GPU.

	*/

	export let width;
	export let height;
	export let x;
	export let y;
	export let scale;
	export let moveCamera;
	export let zoomCamera;
	export let inputEnabled;
	export let earth1LeftOffset;
	export let earth2LeftOffset;
	export let landImages;
	export let seaImages;
	export let activeLandValue;
	export let activeSeaLevel;

	$: imageViewerX = $x * -1 + width / 2;
	$: imageViewerY = $y * -1 + height / 2;
</script>

<ImageViewer
	{width}
	{height}
	x={imageViewerX}
	y={imageViewerY}
	scale={$scale}
	{moveCamera}
	{zoomCamera}
	{inputEnabled}
>
	<div class="earths pixelated">
		<div class="earth" style="left: {earth1LeftOffset}px">
			<BlendedImagesCycle alt="Earth's land" images={landImages} value={activeLandValue} />
			<BlendedImagesContinuum
				alt="Earth's oceans"
				images={seaImages}
				value={activeSeaLevel}
				zIndex={100}
			/>
		</div>
		<div class="earth" style="left: {earth2LeftOffset}px">
			<BlendedImagesCycle alt="Earth's land" images={landImages} value={activeLandValue} />
			<BlendedImagesContinuum
				alt="Earth's oceans"
				images={seaImages}
				value={activeSeaLevel}
				zIndex={100}
			/>
		</div>
	</div>
</ImageViewer>

<style>
	.earths {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.earth {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
