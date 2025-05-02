<script lang="ts">
	import {run} from 'svelte/legacy';

	import {tweened} from 'svelte/motion';
	import {cubicInOut} from 'svelte/easing';
	import {onMount} from 'svelte';
	import {random_float} from '@ryanatkn/belt/random.js';
	import {clock_context} from '$lib/clock.js';
	import {swallow} from '@ryanatkn/belt/dom.js';

	import {dimensions_context} from '$lib/dimensions.js';
	import {enable_global_hotkeys} from '$lib/dom.js';
	import DeepBreathTitleScreen from '$routes/deep-breath/DeepBreathTitleScreen.svelte';
	import DeepBreathTour from '$routes/deep-breath/DeepBreathTour.svelte';
	import MonthHud from '$lib/MonthHud.svelte';
	import SeaLevelHud from '$lib/SeaLevelHud.svelte';
	import Hud from '$lib/Hud.svelte';
	import EarthViewerDom from '$lib/EarthViewerDom.svelte';
	import EarthViewerPixi from '$lib/EarthViewerPixi.svelte';
	import {createResourcesStore} from '$lib/resources.js';
	import {settings_context} from '$lib/settings.js';
	import FloatingIconButton from '$lib/FloatingIconButton.svelte';
	import FloatingTextButton from '$lib/FloatingTextButton.svelte';
	import DeepBreathDevHud from '$routes/deep-breath/DeepBreathDevHud.svelte';
	import Camera from '$lib/Camera.svelte';
	import type Tour from '$lib/Tour.svelte';

	const clock = clock_context.get();

	let camera: Camera | undefined = $state();

	const dimensions = dimensions_context.get();

	// TODO image metadata
	const imageWidth = 4096;
	const imageHeight = 2048;

	const initialX = random_float(0, imageWidth);
	const initialY = random_float($dimensions.height / 2, imageHeight - $dimensions.height / 2);
	const initialWidth = $dimensions.width;
	const initialHeight = $dimensions.height;

	const settings = settings_context.get();

	const debug_start_time = 0; // ~0-300000

	// TODO use Pixi loader instead of the `ResourcesStore` - see the store module for more info
	const resources = createResourcesStore();

	let tour: Tour | undefined = $state();

	// TODO add auto pan button - share logic with Starlit Hanmmock and soggy planet

	let showHud = $state(true);
	const toggleHud = (value = !showHud) => {
		showHud = value;
	};

	let enablePixiEarthViewer = $state(true); // old slow DOM version is available

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

	const on_clickHudToggle = (e: Event) => {
		swallow(e);
		toggleHud();
	};

	// Earth's land
	const landImages = Array.from({length: 12}, (_, i) => `/assets/earth/land_${i + 1}.png`);
	let cycledLandValue = $state(0);
	const landDelay = 230;
	let landTimer = $state(0);

	// Earth's sea
	const seaImages = Array.from({length: 3}, (_, i) => `/assets/earth/sea_${i + 1}.png`);
	const seaImageCount = seaImages.length;
	const seaIndexMax = seaImageCount - 1;
	const seaTimerMax = 1000; // this and the tour movement/pauses are in whole seconds
	let seaTimer = $state(seaTimerMax);
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

	let selectedSeaLevel: number | null = $state(null);
	let hoveredSeaLevel: number | null = $state(null);
	let selectedLandIndex: number | null = $state(null);
	let hoveredLandIndex: number | null = $state(null);

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
	let earth1LeftOffset: number = $state();
	let earth2LeftOffset: number = $state();

	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));

	// in dev mode, bypass the title screen for convenience
	let show_title_screen = $state(true);
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
	let x = $derived(camera?.x);
	let y = $derived(camera?.y);
	let scale = $derived(camera?.scale);
	let width = $derived(camera?.width);
	let height = $derived(camera?.height);
	run(() => {
		if (width) $width = $dimensions.width;
	});
	run(() => {
		if (height) $height = $dimensions.height;
	});
	let dev_mode = $derived($settings.dev_mode);
	let touring = $derived(tour ? tour.touring : null);
	let input_enabled = $derived(!$touring);
	// update every clock tick
	run(() => {
		if (selectedLandIndex === null && hoveredLandIndex === null) {
			landTimer += $clock.dt;
			cycledLandValue = (landTimer / landDelay) % landImages.length;
		}
	});
	let cycledLandIndex = $derived(Math.floor(cycledLandValue));
	run(() => {
		if (selectedSeaLevel === null && hoveredSeaLevel === null) {
			seaTimer -= $clock.dt;
			if (seaTimer <= 0) {
				seaTimer = seaTimerMax;
				nextSeaIndex();
			}
		}
	});
	let activeSeaLevel = $derived(hoveredSeaLevel ?? selectedSeaLevel ?? $seaLevel);
	let activeLandIndex = $derived(hoveredLandIndex ?? selectedLandIndex ?? cycledLandIndex);
	let activeLandValue = $derived(
		activeLandIndex === cycledLandIndex ? cycledLandValue : activeLandIndex,
	);
	run(() => {
		if (x) {
			const xOffsetIndex = Math.floor($x! / imageWidth);
			earth1LeftOffset = xOffsetIndex * imageWidth;
			const xOffsetOverflow = $x! / imageWidth - xOffsetIndex;
			earth2LeftOffset = earth1LeftOffset + imageWidth * (xOffsetOverflow < 0.5 ? -1 : 1);
		}
	});
</script>

<svelte:window onkeydown={onKeyDown} />

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
					<FloatingIconButton label="cancel tour" onclick={tour.cancel}>✕</FloatingIconButton>
				{:else if showHud}
					<FloatingIconButton label="go back to title screen" onclick={returnToTitleScreen}>
						⇦
					</FloatingIconButton>
				{:else}
					<FloatingIconButton
						pressed={showHud}
						label="toggle hud controls"
						onclick={on_clickHudToggle}
					>
						∙∙∙
					</FloatingIconButton>
				{/if}
				{#if showHud && (!$touring || dev_mode)}
					<div class="hud-top-controls">
						<FloatingIconButton
							pressed={showHud}
							label="toggle hud controls"
							onclick={on_clickHudToggle}
						>
							∙∙∙
						</FloatingIconButton>
						{#if tour && !$touring}
							<FloatingTextButton onclick={tour.begin_tour}>tour</FloatingTextButton>
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
