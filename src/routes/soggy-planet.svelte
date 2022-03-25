<script lang="ts">
	import {tweened, type Tweened} from 'svelte/motion';
	import {cubicInOut} from 'svelte/easing';
	import {writable} from 'svelte/store';
	import {onMount} from 'svelte';
	import {randomFloat} from '@feltcoop/felt/util/random.js';

	import SoggyPlanetTitleScreen from '$lib/portals/soggy-planet/SoggyPlanetTitleScreen.svelte';
	import MonthHud from '$lib/app/MonthHud.svelte';
	import SeaLevelHud from '$lib/app/SeaLevelHud.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import EarthViewerDom from '$lib/app/EarthViewerDom.svelte';
	import EarthViewerPixi from '$lib/app/EarthViewerPixi.svelte';
	import {createResourcesStore} from '$lib/app/resourcesStore';
	import {getSettings} from '$lib/app/settingsStore';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import SoggyPlanetDevHud from '$lib/portals/soggy-planet/SoggyPlanetDevHud.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {getDimensions} from '$lib/app/dimensions';
	import {enableGlobalHotkeys} from '$lib/util/dom';

	const clock = getClock();

	const dimensions = getDimensions();
	let width = $dimensions.width;
	let height = $dimensions.height;
	$: width = $dimensions.width;
	$: height = $dimensions.height;

	const settings = getSettings();
	$: devMode = $settings.devMode;

	// TODO image metadata
	const imageWidth = 4096;
	const imageHeight = 2048;

	// TODO use pixi for loading resources
	// TODO add auto pan button - share logic with Starlit Hanmmock
	// TODO pause music with clock
	// TODO bottom+right controls - draw the curve in 2d space to create a custom loop of months+sealevel (with smoothing?)

	let showHud = true;
	const toggleHud = (value = !showHud) => {
		showHud = value;
	};

	let enablePixiEarthViewer = true; // old slow DOM version is available

	// pan and zoom controls
	// use stores for x/y/scale so they can be easily swapped with tweens
	// TODO maybe replace all of this with a camera store?
	const x = writable(randomFloat(0, imageWidth));
	const y = writable(randomFloat(height / 2, imageHeight - height / 2)); // TODO account for different starting scale
	const scale = writable(1);
	const SCALE_FACTOR = 1.1;
	const zoomCamera = (
		zoomDirection: number,
		screenPivotX: number = width / 2,
		screenPivotY: number = height / 2,
	) => {
		if (zoomDirection === 0) return;
		const scaleAmount = zoomDirection > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
		const oldScale = $scale;
		const newScale = oldScale * scaleAmount;
		$scale = newScale;

		// Center relative to the pivot point.
		// When zooming with the mouse, this is the mouse's screen position.
		const scaleRatio = (newScale - oldScale) / oldScale;
		const mouseDistX = screenPivotX - width / 2;
		const mouseDistY = screenPivotY - height / 2;
		const dx = (mouseDistX * scaleRatio) / newScale;
		const dy = (mouseDistY * scaleRatio) / newScale;
		moveCamera(dx, dy);
	};
	const moveCamera = (dx: number, dy: number) => {
		$x += dx;
		$y += dy;
	};

	// TODO refactor global hotkeys system (register them in this component, unregister on unmount)
	const onKeyDown = (e: KeyboardEvent) => {
		if (showTitleScreen) {
			// title screen
			// TODO either hoist `load` or use new global hotkey system in `SoggyPlanetTitleScreen`
			// if (e.key === '1' && enableGlobalHotkeys(e.target)) {
			// 	e.stopPropagation();
			// 	// load();
			// }
		} else {
			// map screen
			if (e.key === 'Escape' && enableGlobalHotkeys(e.target)) {
				e.stopPropagation();
				returnToTitleScreen();
			} else if (e.key === '1' && enableGlobalHotkeys(e.target)) {
				e.stopPropagation();
				toggleHud();
			}
		}
	};

	const onClickHudToggle = (e: Event) => {
		e.stopPropagation();
		toggleHud();
	};

	// Earth's land
	const landImages = Array.from({length: 12}, (_, i) => `/assets/earth/land_${i + 1}.png`);
	let cycledLandValue = 0;
	$: cycledLandIndex = Math.floor(cycledLandValue);
	const landDelay = 230;
	let landTimer = 0;

	// Earth's lights
	// TODO probably want to combine this with a darkening nighttime overlay? ideally in the shape of the real thing, but global to start
	let showLights = true;
	const LIGHTS_IMAGE = `/assets/earth/lights.png`;
	const LIGHTS_OPACITY_MIN = 0;
	const LIGHTS_OPACITY_MAX = 0.91;
	const LIGHTS_OPACITY_CYCLE_TIMER = 3000; // larger is slower
	let lightsOpacity = LIGHTS_OPACITY_MIN;
	$: lightsOpacity = updateLightsOpacity($clock.time);
	$: nightfallOpacity = (lightsOpacity - LIGHTS_OPACITY_MIN) * 0.44;
	const updateLightsOpacity = (time: number): number =>
		LIGHTS_OPACITY_MIN +
		((LIGHTS_OPACITY_MAX - LIGHTS_OPACITY_MIN) *
			(Math.cos(time / LIGHTS_OPACITY_CYCLE_TIMER) + 1)) /
			2;

	// Earth's sea
	const seaImages = Array.from({length: 3}, (_, i) => `/assets/earth/sea_${i + 1}.png`);
	const seaImageCount = seaImages.length;
	const seaIndexMax = seaImageCount - 1;
	const seaTimerMax = 1000; // this and the tour movement/pauses are in whole seconds
	let seaTimer = seaTimerMax;
	const seaLevel = tweened(0, {easing: cubicInOut, duration: seaTimerMax});
	let currentSeaIndex = 0;
	const seaIndexValues = [0, 1].map((v) => Math.round(v * seaIndexMax));
	const nextSeaIndex = () => {
		if (currentSeaIndex >= seaIndexValues.length - 1) {
			currentSeaIndex = 0;
		} else {
			currentSeaIndex++;
		}
		const newSeaIndex = seaIndexValues[currentSeaIndex];
		$seaLevel = newSeaIndex;
	};

	$: {
		// update every clock tick
		const {dt} = $clock;

		if (selectedLandIndex === null && hoveredLandIndex === null) {
			landTimer += dt;
			cycledLandValue = (landTimer / landDelay) % landImages.length;
		}

		if (selectedSeaLevel === null && hoveredSeaLevel === null) {
			seaTimer -= dt;
			if (seaTimer <= 0) {
				seaTimer = seaTimerMax;
				nextSeaIndex();
			}
		}
	}

	let selectedSeaLevel: number | null = null;
	let hoveredSeaLevel: number | null = null;
	$: activeSeaLevel =
		hoveredSeaLevel === null
			? selectedSeaLevel === null
				? $seaLevel
				: selectedSeaLevel
			: hoveredSeaLevel;
	let selectedLandIndex: number | null = null;
	let hoveredLandIndex: number | null = null;
	// TODO use nullish coalescing
	$: activeLandIndex =
		hoveredLandIndex === null
			? selectedLandIndex === null
				? cycledLandIndex
				: selectedLandIndex
			: hoveredLandIndex;
	$: activeLandValue = activeLandIndex === cycledLandIndex ? cycledLandValue : activeLandIndex;

	const setCycledLandValue = (value: number) => {
		landTimer = landDelay * value;
	};
	const selectLandIndex = (index: number | null) => {
		selectedLandIndex = index;
		if (index !== null) setCycledLandValue(index);
	};
	const hoverLandIndex = (index: number | null) => {
		hoveredLandIndex = index;
		if (index !== null) setCycledLandValue(index);
	};
	const selectSeaLevel = (value: number | null) => {
		selectedSeaLevel = value;
	};
	const hoverSeaLevel = (value: number | null) => {
		hoveredSeaLevel = value;
	};

	// Make the two Earths tile seamlessly when possible.
	// We render only 2 instances as a balance between performance and UX.
	// Ideally we'd use WebGL to make rendering multiples much cheaper,
	// but that's currently out of scope for this project.
	let earth1LeftOffset: number;
	let earth2LeftOffset: number;
	$: {
		const xOffsetIndex = Math.floor($x / imageWidth);
		earth1LeftOffset = xOffsetIndex * imageWidth;
		const xOffsetOverflow = $x / imageWidth - xOffsetIndex;
		earth2LeftOffset = earth1LeftOffset + imageWidth * (xOffsetOverflow < 0.5 ? -1 : 1);
	}

	// TODO use Pixi loader instead of the `ResourcesStore` - see the store module for more info
	const resources = createResourcesStore();
	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));
	resources.addResource('image', LIGHTS_IMAGE);

	let xTween: Tweened<number> | null;
	let yTween: Tweened<number> | null;
	let scaleTween: Tweened<number> | null;
	$: if (xTween) $x = $xTween!; // TODO type assertion is needed due to a bug in Svelte language tools
	$: if (yTween) $y = $yTween!; // TODO type assertion is needed due to a bug in Svelte language tools
	$: if (scaleTween) $scale = $scaleTween!; // TODO type assertion is needed due to a bug in Svelte language tools

	// in dev mode, bypass the title screen for convenience
	let showTitleScreen = true;
	const proceed = () => {
		showTitleScreen = false;
	};
	const returnToTitleScreen = () => {
		showTitleScreen = true;
	};
	onMount(() => {
		// in dev mode, bypass the title screen for convenience
		if (devMode) {
			showTitleScreen = false;
			resources.load(); // eslint-disable-line @typescript-eslint/no-floating-promises
		}
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="soggy-planet">
	{#if !showTitleScreen && $resources.status === 'success'}
		{#if enablePixiEarthViewer}
			<EarthViewerPixi
				{landImages}
				{seaImages}
				lightsImage={LIGHTS_IMAGE}
				{lightsOpacity}
				{nightfallOpacity}
				{showLights}
				{activeLandValue}
				{activeSeaLevel}
				{width}
				{height}
				{x}
				{y}
				{scale}
				{moveCamera}
				{zoomCamera}
				{imageWidth}
				{imageHeight}
			/>
		{:else}
			<EarthViewerDom
				{width}
				{height}
				{x}
				{y}
				{scale}
				{moveCamera}
				{zoomCamera}
				{earth1LeftOffset}
				{earth2LeftOffset}
				{landImages}
				{seaImages}
				lightsImage={LIGHTS_IMAGE}
				{lightsOpacity}
				{nightfallOpacity}
				{showLights}
				{activeLandValue}
				{activeSeaLevel}
			/>
		{/if}
		<Hud>
			{#if showHud}
				<FloatingIconButton label="go back to title screen" on:click={returnToTitleScreen}>
					⇦
				</FloatingIconButton>
				<div class="hud-top-controls">
					<FloatingIconButton
						pressed={showHud}
						label="toggle hud controls"
						on:click={onClickHudToggle}
					>
						∙∙∙
					</FloatingIconButton>
				</div>
				<div class="hud-left-controls">
					{#if devMode}
						<SoggyPlanetDevHud
							{x}
							{y}
							{scale}
							togglePixiEarthViewer={(v) => (enablePixiEarthViewer = v)}
							{enablePixiEarthViewer}
						/>
					{/if}
				</div>
				<div class="month-wrapper">
					<MonthHud {activeLandIndex} {selectedLandIndex} {selectLandIndex} {hoverLandIndex} />
				</div>
				<div class="lights-control">
					<FloatingIconButton
						pressed={showLights}
						label="toggle lights"
						on:click={() => (showLights = !showLights)}
					>
						<span class:grayscale={true}>
							{#if showLights}🔆{:else}🔅{/if}
						</span>
					</FloatingIconButton>
				</div>
				<SeaLevelHud
					seaLevel={activeSeaLevel}
					{seaIndexMax}
					{selectedSeaLevel}
					{selectSeaLevel}
					{hoverSeaLevel}
				/>
			{:else}
				<FloatingIconButton
					pressed={showHud}
					label="toggle hud controls"
					on:click={onClickHudToggle}
				>
					∙∙∙
				</FloatingIconButton>
			{/if}
		</Hud>
	{:else}
		<SoggyPlanetTitleScreen {resources} {proceed} />
	{/if}
	<!-- {#if devMode}
		<div
			style="position: fixed; left: calc(50% - 3px); top: calc(50% - 3px); width: 7px; height: 7px;
			background-color: rgba(255, 50, 50, 1);"
		/>
	{/if} -->
</div>

<style>
	.soggy-planet {
		position: relative;
	}

	.hud-top-controls {
		position: absolute;
		left: var(--hud_element_size);
		top: 0;
		display: flex;
	}
	.hud-left-controls {
		position: absolute;
		left: 0;
		top: var(--hud_element_size);
		font-size: 72px;
	}

	.month-wrapper {
		/* TODO make this not fixed */
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100% - var(--hud_element_size));
	}
	.lights-control {
		position: fixed;
		bottom: 0;
		right: 0;
		--font_size: var(--font_size_md);
	}
</style>
