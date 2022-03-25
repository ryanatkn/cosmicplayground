<script lang="ts">
	import type {Readable} from 'svelte/store';

	import ImageViewer from '$lib/app/ImageViewer.svelte';
	import BlendedImagesCycle from '$lib/app/BlendedImagesCycle.svelte';
	import BlendedImagesContinuum from '$lib/app/BlendedImagesContinuum.svelte';

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

	To toggle on the DOM version of the EarthViewer, you need to be in `devMode` -
	press ctrl+backtick and then click "webgl" in the top left.

	*/

	export let width: number;
	export let height: number;
	export let x: Readable<number>;
	export let y: Readable<number>;
	export let scale: Readable<number>;
	export let moveCamera: (dx: number, dy: number) => void;
	export let zoomCamera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
	) => void;
	export let inputEnabled = true;
	export let earth1LeftOffset: number;
	export let earth2LeftOffset: number;
	export let landImages: string[];
	export let seaImages: string[];
	export let shoreImages: string[] | undefined = undefined;
	export let seashoreFloorIndex: number | undefined = undefined;
	export let lightsImage: string | undefined = undefined;
	export let lightsOpacity = 0;
	export let nightfallOpacity = 0;
	export let showLights = false;
	export let activeLandValue: number;
	export let activeSeaLevel: number;

	$: imageViewerX = $x * -1 + width / 2;
	$: imageViewerY = $y * -1 + height / 2;

	$: oceanImages = shoreImages ? shoreImages.concat(seaImages) : seaImages;
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
				images={oceanImages}
				value={activeSeaLevel}
				zIndex={100}
				floorIndex={seashoreFloorIndex}
			/>
			{#if showLights}
				<div class="nightfall" style:opacity={nightfallOpacity} />
				<img
					class="lights"
					src={lightsImage}
					alt="Earth's lights at night"
					style:opacity={lightsOpacity}
				/>
			{/if}
		</div>
		<div class="earth" style="left: {earth2LeftOffset}px">
			<BlendedImagesCycle alt="Earth's land" images={landImages} value={activeLandValue} />
			<BlendedImagesContinuum
				alt="Earth's oceans"
				images={oceanImages}
				value={activeSeaLevel}
				zIndex={100}
				floorIndex={seashoreFloorIndex}
			/>
			{#if showLights}
				<div class="nightfall" style:opacity={nightfallOpacity} />
				<img
					class="lights"
					src={lightsImage}
					alt="Earth's lights at night"
					style:opacity={lightsOpacity}
				/>
			{/if}
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
	.lights {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
		z-index: 120;
	}
	.nightfall {
		/* TODO ideally there's just one of these */
		position: absolute;
		/* inset: 0; */
		left: 0;
		top: 0;
		width: 4096px;
		height: 2048px;
		z-index: 120;
		background-color: #000;
	}

	/* TODO better API for disabling grayscale for this view */
	:global(.paused) {
		filter: none !important;
	}
</style>
