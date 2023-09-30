<script lang="ts">
	import {tweened} from 'svelte/motion';
	import {cubicInOut} from 'svelte/easing';
	import {onMount} from 'svelte';
	import {random_float} from '@grogarden/util/random.js';
	import {get_clock} from '@ryanatkn/dealt/clock.js';
	import {swallow} from '@grogarden/util/dom.js';
	import {enable_global_hotkeys, get_contextmenu_dimensions} from '@ryanatkn/dealt';

	import DeepBreathTitleScreen from '$routes/deep-breath/DeepBreathTitleScreen.svelte';
	import DeepBreathTour from '$routes/deep-breath/DeepBreathTour.svelte';
	import MonthHud from '$lib/app/MonthHud.svelte';
	import SeaLevelHud from '$lib/app/SeaLevelHud.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import EarthViewerDom from '$lib/app/EarthViewerDom.svelte';
	import EarthViewerPixi from '$lib/app/EarthViewerPixi.svelte';
	import {createResourcesStore} from '$lib/app/resources';
	import {get_settings} from '$lib/app/settings';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import DeepBreathDevHud from '$routes/deep-breath/DeepBreathDevHud.svelte';
	import Camera from '$lib/app/Camera.svelte';
	import type Tour from '$lib/app/Tour.svelte';

	const clock = get_clock();

	let camera: Camera | undefined;
	$: x = camera?.x;
	$: y = camera?.y;
	$: scale = camera?.scale;
	$: width = camera?.width;
	$: height = camera?.height;

	const dimensions = get_contextmenu_dimensions();
	$: if (width) $width = $dimensions.width;
	$: if (height) $height = $dimensions.height;

	// TODO image metadata
	const imageWidth = 4096;
	const imageHeight = 2048;

	const initialX = random_float(0, imageWidth);
	const initialY = random_float($dimensions.height / 2, imageHeight - $dimensions.height / 2);
	const initialWidth = $dimensions.width;
	const initialHeight = $dimensions.height;

	const settings = get_settings();
	$: dev_mode = $settings.dev_mode;

	const debug_start_time = 0; // ~0-300000

	// TODO use Pixi loader instead of the `ResourcesStore` - see the store module for more info
	const resources = createResourcesStore();

	let tour: Tour | undefined;
	$: touring = tour ? tour.touring : null;

	// TODO add auto pan button - share logic with Starlit Hanmmock and soggy planet

	let showHud = true;
	const toggleHud = (value = !showHud) => {
		showHud = value;
	};

	let enablePixiEarthViewer = true; // old slow DOM version is available

	$: input_enabled = !$touring;

	// TODO refactor global hotkeys system (register them in this component, unregister on unmount)
	const onKeyDown = (e: KeyboardEvent) => {
		if (show_title_screen) return;
		// map screen
		if (!input_enabled) return;
		if (e.key === 'Escape' && !e.ctrlKey && enable_global_hotkeys(e.target)) {
			swallow(e);
			returnToTitleScreen();
		} else if (e.key === '1' && enable_global_hotkeys(e.target)) {
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

	const onBeginTour = () => {
		console.log('BEGIN TOUR');
		selectLandIndex(null);
		hoverLandIndex(null);
		selectSeaLevel(null);
		hoverSeaLevel(null);
	};

	// For the DOM renderer, make the two Earths tile seamlessly when possible.
	// We render only 2 instances as a balance between performance and UX.
	let earth1LeftOffset: number;
	let earth2LeftOffset: number;
	$: if (x) {
		const xOffsetIndex = Math.floor($x! / imageWidth);
		earth1LeftOffset = xOffsetIndex * imageWidth;
		const xOffsetOverflow = $x! / imageWidth - xOffsetIndex;
		earth2LeftOffset = earth1LeftOffset + imageWidth * (xOffsetOverflow < 0.5 ? -1 : 1);
	}

	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));

	// in dev mode, bypass the title screen for convenience
	let show_title_screen = true;
	const proceed = () => {
		show_title_screen = false;
	};
	const returnToTitleScreen = () => {
		if ($touring) tour!.cancel();
		show_title_screen = true;
	};
	onMount(() => {
		// in dev mode, bypass the title screen for convenience
		if (dev_mode) {
			show_title_screen = false;
			void resources.load();
		}
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<Camera bind:this={camera} {initialX} {initialY} {initialWidth} {initialHeight} />

{#if camera && x && y && scale}
	<div class="deep-breath">
		{#if !show_title_screen && $resources.status === 'success'}
			{#if enablePixiEarthViewer}
				<EarthViewerPixi
					{camera}
					{landImages}
					{seaImages}
					{activeLandValue}
					{activeSeaLevel}
					{input_enabled}
					{imageWidth}
					{imageHeight}
				/>
			{:else}
				<EarthViewerDom
					{camera}
					{input_enabled}
					{earth1LeftOffset}
					{earth2LeftOffset}
					{landImages}
					{seaImages}
					{activeLandValue}
					{activeSeaLevel}
				/>
			{/if}
			<DeepBreathTour {camera} bind:tour on:begin={onBeginTour} />
			<Hud>
				{#if tour && $touring}
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
				{#if showHud && (!$touring || dev_mode)}
					<div class="hud-top-controls">
						<FloatingIconButton
							pressed={showHud}
							label="toggle hud controls"
							on:click={onClickHudToggle}
						>
							∙∙∙
						</FloatingIconButton>
						{#if tour && !$touring}
							<FloatingTextButton on:click={tour.begin_tour}>tour</FloatingTextButton>
						{/if}
					</div>
					<div class="hud-left-controls">
						{#if dev_mode}
							<DeepBreathDevHud
								tour={tour || null}
								{x}
								{y}
								{scale}
								togglePixiEarthViewer={(v) => (enablePixiEarthViewer = v)}
								{enablePixiEarthViewer}
								{debug_start_time}
							/>
						{/if}
					</div>
					{#if !$touring}
						<div class="month-wrapper">
							<MonthHud
								active_land_index={activeLandIndex}
								selected_land_index={selectedLandIndex}
								select_land_index={selectLandIndex}
								hover_land_index={hoverLandIndex}
							/>
						</div>
						<SeaLevelHud
							sea_level={activeSeaLevel}
							sea_index_max={seaIndexMax}
							selected_sea_level={selectedSeaLevel}
							select_sea_level={selectSeaLevel}
							hover_sea_level={hoverSeaLevel}
						/>
					{/if}
				{/if}
			</Hud>
		{:else}
			<DeepBreathTitleScreen {resources} {proceed} />
		{/if}
	</div>
{/if}

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
