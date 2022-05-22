<script lang="ts">
	import {writable} from 'svelte/store';
	import {onMount} from 'svelte';
	import {randomFloat} from '@feltcoop/felt/util/random.js';

	import SoggyPlanetTitleScreen from '$lib/portals/soggy-planet/SoggyPlanetTitleScreen.svelte';
	import MonthHud from '$lib/app/MonthHud.svelte';
	import SeaLevelHud from '$lib/app/SeaLevelHud.svelte';
	import DaylightHud from '$lib/app/DaylightHud.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import EarthViewerDom from '$lib/app/EarthViewerDom.svelte';
	import EarthViewerPixi from '$lib/app/EarthViewerPixi.svelte';
	import {createResourcesStore} from '$lib/app/resources';
	import {getSettings} from '$lib/app/settings';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import SoggyPlanetDevHud from '$lib/portals/soggy-planet/SoggyPlanetDevHud.svelte';
	import {getClock} from '$lib/app/clock';
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
			if (e.key === 'Escape' && !e.ctrlKey && enableGlobalHotkeys(e.target)) {
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

	// Earth's lights
	const LIGHTS_IMAGE = `/assets/earth/lights.png`;
	const LIGHTS_OPACITY_MIN = 0;
	const LIGHTS_OPACITY_MAX = 0.91;
	const LIGHTS_OPACITY_CYCLE_TIMER = 3000; // larger is slower
	let lightsOpacity = LIGHTS_OPACITY_MIN;
	let lightsTimer = LIGHTS_OPACITY_CYCLE_TIMER * 1.7;
	$: if (selectedDaylight === null) lightsTimer += $clock.dt;
	$: lightsOpacity = toLightsOpacity(lightsTimer);
	const toLightsOpacity = (time: number): number =>
		LIGHTS_OPACITY_MIN +
		((LIGHTS_OPACITY_MAX - LIGHTS_OPACITY_MIN) *
			(Math.sin(time / LIGHTS_OPACITY_CYCLE_TIMER) + 1)) /
			2;
	// TODO would be cool to have nightfall overlay the shape of the real thing, not global
	$: nightfallOpacity = (lightsOpacity - LIGHTS_OPACITY_MIN) * 0.48;

	// TODO this is weird because the shore images were bolted on after the fact.
	// Refactoring the sea images to have a single base and later the second/third above would be ideal

	// Earth's sea
	const seaImages = Array.from({length: 3}, (_, i) => `/assets/earth/sea_${i + 1}.png`);
	// Earth's shores beneath the current sea level
	const shoreImages = Array.from({length: 10}, (_, i) => `/assets/earth/shore_${10 - i}.png`);
	const seashoreFloorIndex = shoreImages.length;
	const seaIndexMax = seaImages.length + shoreImages.length - 1;
	const SEA_LEVEL_CYCLE_TIMER = 1000; // larger is slower
	let seaLevelTimer = SEA_LEVEL_CYCLE_TIMER * 2.5;
	$: if (selectedSeaLevel === null && hoveredSeaLevel === null) {
		seaLevelTimer += $clock.dt;
	}
	const toSeaLevel = (time: number): number =>
		(seaIndexMax * (Math.sin(time / SEA_LEVEL_CYCLE_TIMER) + 1)) / 2;
	let seaLevel = toSeaLevel(seaLevelTimer);
	$: seaLevel = toSeaLevel(seaLevelTimer);

	// update every clock tick
	const LAND_DELAY = 230;
	let landTimer = 0;
	$: if (selectedLandIndex === null && hoveredLandIndex === null) {
		landTimer += $clock.dt;
		cycledLandValue = (landTimer / LAND_DELAY) % landImages.length;
	}

	let selectedSeaLevel: number | null = null;
	let hoveredSeaLevel: number | null = null;
	$: activeSeaLevel = hoveredSeaLevel ?? selectedSeaLevel ?? seaLevel;
	const selectSeaLevel = (value: number | null) => {
		selectedSeaLevel = value;
	};
	const hoverSeaLevel = (value: number | null) => {
		hoveredSeaLevel = value;
	};

	let selectedLandIndex: number | null = null;
	let hoveredLandIndex: number | null = null;
	$: activeLandIndex = hoveredLandIndex ?? selectedLandIndex ?? cycledLandIndex;
	$: activeLandValue = activeLandIndex === cycledLandIndex ? cycledLandValue : activeLandIndex;
	const setCycledLandValue = (value: number) => {
		landTimer = LAND_DELAY * value;
	};
	const selectLandIndex = (index: number | null) => {
		selectedLandIndex = index;
		if (index !== null) setCycledLandValue(index);
	};
	const hoverLandIndex = (index: number | null) => {
		hoveredLandIndex = index;
		if (index !== null) setCycledLandValue(index);
	};

	let selectedDaylight: number | null = null;
	let hoveredDaylight: number | null = null;
	$: activeDaylight = hoveredDaylight ?? selectedDaylight ?? seaLevel;
	const selectDaylight = (value: number | null) => {
		selectedDaylight = value;
	};
	const hoverDaylight = (value: number | null) => {
		hoveredDaylight = value;
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
	shoreImages.forEach((url) => resources.addResource('image', url));
	resources.addResource('image', LIGHTS_IMAGE);

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
			void resources.load();
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
				{shoreImages}
				{seashoreFloorIndex}
				lightsImage={LIGHTS_IMAGE}
				{lightsOpacity}
				{nightfallOpacity}
				showLights={true}
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
				{shoreImages}
				{seashoreFloorIndex}
				lightsImage={LIGHTS_IMAGE}
				{lightsOpacity}
				{nightfallOpacity}
				showLights={true}
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
					<DaylightHud
						daylight={activeDaylight}
						{selectedDaylight}
						{selectDaylight}
						{hoverDaylight}
					/>
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
		width: 100%;
	}
</style>
