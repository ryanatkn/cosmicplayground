<script lang="ts">
	import ImageViewer from '$lib/ImageViewer.svelte';
	import BlendedImagesCycle from '$lib/BlendedImagesCycle.svelte';
	import BlendedImagesContinuum from '$lib/BlendedImagesContinuum.svelte';
	import type Camera from '$lib/Camera.svelte';

	interface Props {
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

	To toggle on the DOM version of the EarthViewer, you need to be in `dev_mode` -
	press ctrl+backtick and then click "webgl" in the top left.

	*/
		camera: Camera;
		input_enabled?: boolean;
		earth1LeftOffset: number;
		earth2LeftOffset: number;
		landImages: string[];
		seaImages: string[];
		shoreImages?: string[] | undefined;
		seashoreFloorIndex?: number | undefined;
		lightsImage?: string | undefined;
		lightsOpacity?: number;
		nightfallOpacity?: number;
		showLights?: boolean;
		activeLandValue: number;
		activeSeaLevel: number;
	}

	let {
		camera,
		input_enabled = true,
		earth1LeftOffset,
		earth2LeftOffset,
		landImages,
		seaImages,
		shoreImages = undefined,
		seashoreFloorIndex = undefined,
		lightsImage = undefined,
		lightsOpacity = 0,
		nightfallOpacity = 0,
		showLights = false,
		activeLandValue,
		activeSeaLevel,
	}: Props = $props();

	let {x, y, width, height, scale} = $derived(camera);

	let imageViewerX = $derived($x * -1 + $width / 2);
	let imageViewerY = $derived($y * -1 + $height / 2);

	let oceanImages = $derived(shoreImages ? shoreImages.concat(seaImages) : seaImages);
</script>

<ImageViewer
	width={$width}
	height={$height}
	x={imageViewerX}
	y={imageViewerY}
	scale={$scale}
	move_camera={camera.move_camera}
	zoom_camera={camera.zoom_camera}
	{input_enabled}
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
				<div class="nightfall" style:opacity={nightfallOpacity}></div>
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
				<div class="nightfall" style:opacity={nightfallOpacity}></div>
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
