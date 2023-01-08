<script lang="ts">
	import {onMount} from 'svelte';
	import {randomFloat} from '@feltcoop/util/random.js';
	import {swallow} from '@feltcoop/util/dom.js';

	import SoggyPlanetTitleScreen from './SoggyPlanetTitleScreen.svelte';
	import MonthHud from '$lib/app/MonthHud.svelte';
	import SeaLevelHud from '$lib/app/SeaLevelHud.svelte';
	import DaylightHud from '$lib/app/DaylightHud.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import EarthViewerPixi from '$lib/app/EarthViewerPixi.svelte';
	import {createResourcesStore} from '$lib/app/resources';
	import {getSettings} from '$lib/app/settings';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import SoggyPlanetDevHud from './SoggyPlanetDevHud.svelte';
	import SoggyPlanetTour from './SoggyPlanetTour.svelte';
	import {getClock} from '$lib/app/clock';
	import {getDimensions} from '$lib/app/dimensions';
	import {enableGlobalHotkeys} from '$lib/util/dom';
	import Camera from '$lib/app/Camera.svelte';
	import type Tour from '$lib/app/Tour.svelte';
	import {SHORE_COUNT} from './constants';

	const clock = getClock();

	let camera: Camera | undefined;
	$: x = camera?.x;
	$: y = camera?.y;
	$: scale = camera?.scale;
	$: width = camera?.width;
	$: height = camera?.height;

	const dimensions = getDimensions();
	$: if (width) $width = $dimensions.width;
	$: if (height) $height = $dimensions.height;

	// TODO image metadata
	const imageWidth = 4096;
	const imageHeight = 2048;

	const initialX = randomFloat(0, imageWidth);
	const initialY = randomFloat($dimensions.height / 2, imageHeight - $dimensions.height / 2);
	const initialWidth = $dimensions.width;
	const initialHeight = $dimensions.height;

	const settings = getSettings();
	$: devMode = $settings.devMode;

	let tour: Tour | undefined;
	$: touring = tour ? tour.touring : null;

	// TODO add auto pan button - share logic with Starlit Hanmmock and deep breath

	let showHud = true;
	const toggleHud = (value = !showHud) => {
		showHud = value;
	};

	// TODO refactor global hotkeys system (register them in this component, unregister on unmount)
	const onKeyDown = (e: KeyboardEvent) => {
		if (showTitleScreen) return;
		// map screen
		if (e.key === 'Escape' && !e.ctrlKey && enableGlobalHotkeys(e.target)) {
			swallow(e);
			returnToTitleScreen();
		} else if (e.key === '1' && enableGlobalHotkeys(e.target)) {
			swallow(e);
			toggleHud();
		}
	};

	const onClickHudToggle = (e: Event) => {
		swallow(e);
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
	$: nightfallOpacity = (activeDaylight - LIGHTS_OPACITY_MIN) * 0.48;

	// TODO this is weird because the shore images were bolted on after the fact.
	// Refactoring the sea images to have a single base and later the second/third above would be ideal

	// Earth's sea
	const seaImages = Array.from({length: 3}, (_, i) => `/assets/earth/sea_${i + 1}.png`);
	const shoreImage = '/assets/earth/shore.png';
	const seashoreFloorIndex = SHORE_COUNT;
	const seaIndexMax = seaImages.length + SHORE_COUNT - 1;
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

	const onBeginTour = () => {
		selectLandIndex(null);
		hoverLandIndex(null);
		selectSeaLevel(14);
		hoverSeaLevel(null);
		selectDaylight(1);
		hoverDaylight(null);
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
	$: activeDaylight = hoveredDaylight ?? selectedDaylight ?? lightsOpacity;
	const selectDaylight = (value: number | null) => {
		selectedDaylight = value;
	};
	const hoverDaylight = (value: number | null) => {
		hoveredDaylight = value;
	};

	// TODO use Pixi loader instead of the `ResourcesStore` - see the store module for more info
	const resources = createResourcesStore();
	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));
	resources.addResource('image', shoreImage);
	resources.addResource('image', LIGHTS_IMAGE);

	// in dev mode, bypass the title screen for convenience
	let showTitleScreen = true;
	const proceed = () => {
		showTitleScreen = false;
	};
	const returnToTitleScreen = () => {
		if ($touring) tour!.cancel();
		showTitleScreen = true;
	};
	onMount(() => {
		// in dev mode, bypass the title screen for convenience
		if (devMode) {
			showTitleScreen = false;
			void resources.load();
		}
	});

	const DISABLED_UNTIL_READY = true;
</script>

<svelte:window on:keydown={onKeyDown} />

<Camera bind:this={camera} {initialX} {initialY} {initialWidth} {initialHeight} />

{#if camera && x && y && scale}
	<div class="soggy-planet">
		{#if !showTitleScreen && $resources.status === 'success'}
			<EarthViewerPixi
				{camera}
				{landImages}
				{seaImages}
				{shoreImage}
				shoreImageCount={SHORE_COUNT}
				{seashoreFloorIndex}
				lightsImage={LIGHTS_IMAGE}
				lightsOpacity={activeDaylight}
				{nightfallOpacity}
				showLights={true}
				{activeLandValue}
				{activeSeaLevel}
				{imageWidth}
				{imageHeight}
			/>
			<SoggyPlanetTour {camera} bind:tour on:begin={onBeginTour} />
			<Hud>
				{#if tour && $touring}
					<FloatingIconButton label="cancel tour" on:click={tour.cancel}>✕</FloatingIconButton>
				{:else if showHud}
					<FloatingIconButton label="go back to title screen" on:click={returnToTitleScreen}>
						⇦
					</FloatingIconButton>
				{:else}
					<div class="hud-top-controls">
						<FloatingIconButton
							pressed={showHud}
							label="toggle hud controls"
							on:click={onClickHudToggle}
						>
							∙∙∙
						</FloatingIconButton>
					</div>
				{/if}
				{#if !$touring || devMode}
					{#if showHud}
						<div class="hud-top-controls">
							<FloatingIconButton
								pressed={showHud}
								label="toggle hud controls"
								on:click={onClickHudToggle}
							>
								∙∙∙
							</FloatingIconButton>
							{#if !DISABLED_UNTIL_READY && tour && !$touring}
								<FloatingTextButton on:click={tour.beginTour}>tour</FloatingTextButton>
							{/if}
						</div>
						<div class="hud-left-controls">
							<DaylightHud
								daylight={activeDaylight}
								{selectedDaylight}
								{selectDaylight}
								{hoverDaylight}
							/>
							{#if devMode}
								<SoggyPlanetDevHud {x} {y} {scale} />
							{/if}
						</div>
						{#if !$touring}
							<div class="month-wrapper">
								<MonthHud
									{activeLandIndex}
									{selectedLandIndex}
									{selectLandIndex}
									{hoverLandIndex}
								/>
							</div>
							<SeaLevelHud
								seaLevel={activeSeaLevel}
								{seaIndexMax}
								{selectedSeaLevel}
								{selectSeaLevel}
								{hoverSeaLevel}
							/>
						{/if}
					{/if}
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
{/if}

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
		position: fixed;
		left: 0;
		top: var(--hud_element_size);
		height: calc(100% - 2 * var(--hud_element_size));
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
