<script lang="ts">
	import {tweened} from 'svelte/motion';
	import {cubicInOut} from 'svelte/easing';
	import {onMount} from 'svelte';
	import {randomFloat} from '@feltcoop/felt/util/random.js';

	import DeepBreathTitleScreen from '$lib/portals/deep-breath/DeepBreathTitleScreen.svelte';
	import DeepBreathTour from '$lib/portals/deep-breath/DeepBreathTour.svelte';
	import type {DeepBreathTourManager} from '$lib/portals/deep-breath/DeepBreathTour.svelte';
	import MonthHud from '$lib/app/MonthHud.svelte';
	import SeaLevelHud from '$lib/app/SeaLevelHud.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import EarthViewerDom from '$lib/app/EarthViewerDom.svelte';
	import EarthViewerPixi from '$lib/app/EarthViewerPixi.svelte';
	import {createResourcesStore} from '$lib/app/resources';
	import {getSettings} from '$lib/app/settings';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import DeepBreathDevHud from '$lib/portals/deep-breath/DeepBreathDevHud.svelte';
	import {getClock} from '$lib/app/clock';
	import {getDimensions} from '$lib/app/dimensions';
	import {enableGlobalHotkeys} from '$lib/util/dom';
	import {createCamera2} from '$lib/app/camera2';

	const clock = getClock();

	const camera = createCamera2();
	const {x, y, width, height, scale} = camera;

	const dimensions = getDimensions();
	$width = $dimensions.width;
	$height = $dimensions.height;
	$: $width = $dimensions.width;
	$: $height = $dimensions.height;

	// TODO image metadata
	const imageWidth = 4096;
	const imageHeight = 2048;
	// TODO eslint+svelte issue, these overrides shouldn't be needed
	$x = randomFloat(0, imageWidth); // eslint-disable-line prefer-const
	$y = randomFloat($height / 2, imageHeight - $height / 2); // eslint-disable-line prefer-const

	const settings = getSettings();
	$: devMode = $settings.devMode;

	const debugStartTime = 0; // ~0-300000

	// TODO use Pixi loader instead of the `ResourcesStore` - see the store module for more info
	const resources = createResourcesStore();
	// TODO eslint+svelte issue, this override shouldn't be needed
	let tourManager: DeepBreathTourManager | undefined; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
	$: tourStore = tourManager ? tourManager.tour : null;
	$: tour = tourStore ? $tourStore : null;

	// TODO add auto pan button - share logic with Starlit Hanmmock and soggy planet

	let showHud = true;
	const toggleHud = (value = !showHud) => {
		showHud = value;
	};

	let enablePixiEarthViewer = true; // old slow DOM version is available

	$: inputEnabled = !tour;

	// TODO refactor global hotkeys system (register them in this component, unregister on unmount)
	const onKeyDown = (e: KeyboardEvent) => {
		if (showTitleScreen) return;
		// map screen
		if (!inputEnabled) return;
		if (e.key === 'Escape' && !e.ctrlKey && enableGlobalHotkeys(e.target)) {
			e.stopPropagation();
			returnToTitleScreen();
		} else if (e.key === '1' && enableGlobalHotkeys(e.target)) {
			e.stopPropagation();
			toggleHud();
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

	// update every clock tick
	$: if (selectedLandIndex === null && hoveredLandIndex === null) {
		landTimer += $clock.dt;
		cycledLandValue = (landTimer / landDelay) % landImages.length;
	}
	$: if (selectedSeaLevel === null && hoveredSeaLevel === null) {
		seaTimer -= $clock.dt;
		if (seaTimer <= 0) {
			seaTimer = seaTimerMax;
			nextSeaIndex();
		}
	}

	let selectedSeaLevel: number | null = null;
	let hoveredSeaLevel: number | null = null;
	$: activeSeaLevel = hoveredSeaLevel ?? selectedSeaLevel ?? $seaLevel;
	let selectedLandIndex: number | null = null;
	let hoveredLandIndex: number | null = null;
	$: activeLandIndex = hoveredLandIndex ?? selectedLandIndex ?? cycledLandIndex;
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

	const resetSeaLevelInteractionState = () => {
		selectedSeaLevel = null;
		hoveredSeaLevel = null;
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

	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));

	// in dev mode, bypass the title screen for convenience
	let showTitleScreen = true;
	const proceed = () => {
		showTitleScreen = false;
	};
	const returnToTitleScreen = () => {
		tour?.cancel();
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

<div class="deep-breath">
	{#if !showTitleScreen && $resources.status === 'success'}
		{#if enablePixiEarthViewer}
			<EarthViewerPixi
				{camera}
				{landImages}
				{seaImages}
				{activeLandValue}
				{activeSeaLevel}
				{inputEnabled}
				{imageWidth}
				{imageHeight}
			/>
		{:else}
			<EarthViewerDom
				{camera}
				{inputEnabled}
				{earth1LeftOffset}
				{earth2LeftOffset}
				{landImages}
				{seaImages}
				{activeLandValue}
				{activeSeaLevel}
			/>
		{/if}
		<DeepBreathTour {camera} bind:tourManager on:begin={resetSeaLevelInteractionState} />
		<Hud>
			{#if tour}
				<FloatingIconButton label="cancel tour" on:click={tour.cancel}>✕</FloatingIconButton>
			{:else if showHud}
				<FloatingIconButton label="go back to title screen" on:click={returnToTitleScreen}>
					⇦
				</FloatingIconButton>
			{:else}
				<FloatingIconButton
					pressed={showHud}
					label="toggle hud controls"
					on:click={onClickHudToggle}
				>
					∙∙∙
				</FloatingIconButton>
			{/if}
			{#if !tour || devMode}
				{#if showHud}
					<div class="hud-top-controls">
						<FloatingIconButton
							pressed={showHud}
							label="toggle hud controls"
							on:click={onClickHudToggle}
						>
							∙∙∙
						</FloatingIconButton>
						{#if tourManager && !tour}
							<FloatingTextButton on:click={tourManager.beginTour}>tour</FloatingTextButton>
						{/if}
					</div>
					<div class="hud-left-controls">
						{#if devMode}
							<DeepBreathDevHud
								{tour}
								{x}
								{y}
								{scale}
								togglePixiEarthViewer={(v) => (enablePixiEarthViewer = v)}
								{enablePixiEarthViewer}
								{debugStartTime}
							/>
						{/if}
					</div>
					{#if !tour}
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
					{/if}
				{/if}
			{/if}
		</Hud>
	{:else}
		<DeepBreathTitleScreen {resources} {proceed} />
	{/if}
</div>

<style>
	.deep-breath {
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
</style>
