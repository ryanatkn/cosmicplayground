<script lang="ts">
	import {tweened, type Tweened} from 'svelte/motion';
	import {cubicInOut, sineInOut} from 'svelte/easing';
	import {writable} from 'svelte/store';
	import {onDestroy, onMount} from 'svelte';
	import {randomFloat} from '@feltcoop/felt/util/random.js';

	import DeepBreathTitleScreen from '$lib/portals/deep-breath/DeepBreathTitleScreen.svelte';
	import MonthHud from '$lib/app/MonthHud.svelte';
	import SeaLevelHud from '$lib/app/SeaLevelHud.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import EarthViewerDom from '$lib/app/EarthViewerDom.svelte';
	import EarthViewerPixi from '$lib/app/EarthViewerPixi.svelte';
	import {createResourcesStore, type AudioResource} from '$lib/app/resourcesStore';
	import {createDeepBreathTour} from '$lib/portals/deep-breath/deepBreathTour';
	import {createTourStore, type TourData, type TourStep, type TourStore} from '$lib/app/tourStore';
	import DeepBreathTourIntro from '$lib/portals/deep-breath/DeepBreathTourIntro.svelte';
	import DeepBreathTourTitle from '$lib/portals/deep-breath/DeepBreathTourTitle.svelte';
	import DeepBreathTourCredits from '$lib/portals/deep-breath/DeepBreathTourCredits.svelte';
	import {getSettings} from '$lib/app/settingsStore';
	import {resetRenderStats, getRenderStats} from '$lib/app/renderStats';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import DeepBreathDevHud from '$lib/portals/deep-breath/DeepBreathDevHud.svelte';
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
	$: audioEnabled = $settings.audioEnabled;

	const debugStartTime = 0; // ~0-300000

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
			// TODO either hoist `load` or use new global hotkey system in `DeepBreathTitleScreen`
			// if (e.key === '1' && enableGlobalHotkeys(e.target)) {
			// 	e.stopPropagation();
			// 	// load();
			// }
		} else {
			// map screen
			if (tour) {
				if (e.key === 'Escape') {
					e.stopPropagation();
					tour.cancel();
				}
			} else {
				if (!inputEnabled) return;
				if (e.key === 'Escape' && enableGlobalHotkeys(e.target)) {
					e.stopPropagation();
					returnToTitleScreen();
				} else if (e.key === '1' && enableGlobalHotkeys(e.target)) {
					e.stopPropagation();
					toggleHud();
				}
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

	// TODO use Pixi loader instead of the `ResourcesStore` - see the store module for more info
	const resources = createResourcesStore();
	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));

	let xTween: Tweened<number> | null;
	let yTween: Tweened<number> | null;
	let scaleTween: Tweened<number> | null;
	$: if (xTween) $x = $xTween!; // TODO type assertion is needed due to a bug in Svelte language tools
	$: if (yTween) $y = $yTween!; // TODO type assertion is needed due to a bug in Svelte language tools
	$: if (scaleTween) $scale = $scaleTween!; // TODO type assertion is needed due to a bug in Svelte language tools
	const updatePanTweens = (
		xTarget: number,
		yTarget: number,
		duration: number,
		easing = sineInOut,
	) => {
		if (!xTween) xTween = tweened($x);
		xTween.set(xTarget, {duration, easing}); // eslint-disable-line @typescript-eslint/no-floating-promises
		if (!yTween) yTween = tweened($y);
		yTween.set(yTarget, {duration, easing}); // eslint-disable-line @typescript-eslint/no-floating-promises
	};
	const updateScaleTween = (scaleTarget: number, duration: number, easing = sineInOut) => {
		if (!scaleTween) scaleTween = tweened($scale);
		scaleTween.set(scaleTarget, {duration, easing}); // eslint-disable-line @typescript-eslint/no-floating-promises
	};
	const resetTweens = () => {
		xTween = null;
		yTween = null;
		scaleTween = null;
	};
	let tour: TourStore | null = null;
	let tourData: TourData;
	let showTourIntro = false;
	let showTourTitle = false;
	let showTourCredits = false;
	const tourResources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	const tourSongUrl = '/assets/audio/Alexander_Nakarada__Winter.mp3';
	const oceanWavesSoundUrl = '/assets/audio/ocean_waves.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: tourSong = ...`
	tourResources.addResource('audio', tourSongUrl);
	tourResources.addResource('audio', oceanWavesSoundUrl);
	let tourSong: AudioResource;
	$: tourSong = $tourResources.resources.find((r) => r.url === tourSongUrl) as any; // TODO faster API, or maybe remove (see comment above)
	let oceanWavesSound: AudioResource;
	$: oceanWavesSound = $tourResources.resources.find((r) => r.url === oceanWavesSoundUrl) as any; // TODO faster API, or maybe remove (see comment above)
	const tourIntroTransitionInDuration = 2000;
	const tourIntroTransitionOutDuration = 2000;
	const tourIntroPauseDuration = 3000;
	const tourIntroMaxDelay = 6000;
	const tourIntroTotalDuration =
		tourIntroTransitionInDuration +
		tourIntroMaxDelay +
		tourIntroPauseDuration +
		tourIntroTransitionOutDuration;
	const tourTitleTransitionDuration = 2000;
	const tourTitlePauseDuration = 3000;
	const tourTitleMaxDelay = 250;
	const tourTitleTotalDuration =
		tourTitleTransitionDuration * 2 + tourTitleMaxDelay + tourTitlePauseDuration;
	const beginTour = () => {
		if (tour) {
			tour.cancel();
		}
		resetSeaLevelInteractionState();
		if (!tourData) {
			tourData = createDeepBreathTour(tourIntroTotalDuration, tourTitleTotalDuration, devMode);
		}
		const oceanWavesPlayStep = tourData.steps.find(
			(s) => 'name' in s && s.name === 'playOceanWavesSound',
		); // TODO or get from event handler?
		const tourSongPlayStep = tourData.steps.find((s) => 'name' in s && s.name === 'playSong'); // TODO or get from event handler?
		tour = createTourStore(tourData, clock, {
			pan: (xTarget, yTarget, duration, easing) => {
				updatePanTweens(xTarget, yTarget, duration, easing);
			},
			zoom: (scaleTarget, duration, easing) => {
				updateScaleTween(scaleTarget, duration, easing);
			},
			event: (name, _data) => {
				if (name.startsWith('debug')) {
					console.log(name, ($tour as any).currentTime);
					return;
				}
				switch (name) {
					case 'load': {
						return tourResources.load(); // is idempotent
					}
					case 'playOceanWavesSound': {
						oceanWavesSound.audio!.currentTime = 0;
						if (audioEnabled) oceanWavesSound.audio!.play(); // eslint-disable-line @typescript-eslint/no-floating-promises
						return;
					}
					case 'playSong': {
						tourSong.audio!.currentTime = 0;
						if (audioEnabled) tourSong.audio!.play(); // eslint-disable-line @typescript-eslint/no-floating-promises
						return;
					}
					case 'showIntro': {
						showTourIntro = true;
						return;
					}
					case 'showTitle': {
						showTourTitle = true;
						return;
					}
					case 'showCredits': {
						showTourCredits = true;
						return;
					}
					default: {
						throw Error(`Unknown pause name '${name}'`);
					}
				}
			},
			seek: (currentTime, _currentStepIndex) => {
				// TODO this hacky code could be replaced by adding abstractions to the tour
				// to manage things like audio and displaying specific content for a time window
				updateAudioOnSeek(oceanWavesSound.audio!, oceanWavesPlayStep!, currentTime);
				updateAudioOnSeek(tourSong.audio!, tourSongPlayStep!, currentTime);
				showTourIntro = false;
				showTourTitle = false;
				showTourCredits = false;
			},
			done: (_completed) => {
				tour = null;
				showTourIntro = false;
				showTourTitle = false;
				showTourCredits = false;
				resetTweens();
				if ($scale > 50) $scale = 50; // TODO tween
				if (tourSong.audio && !tourSong.audio.paused) tourSong.audio.pause();
				if (oceanWavesSound.audio && !oceanWavesSound.audio.paused) oceanWavesSound.audio.pause();
				if (devMode) console.log('render stats', getRenderStats());
			},
		});
		if (devMode) {
			resetRenderStats();
			if (debugStartTime) setTimeout(() => tour!.seekTimeTo(debugStartTime), 50);
		}
	};
	const updateAudioOnSeek = (audio: HTMLAudioElement, step: TourStep, currentTime: number) => {
		const stepCurrentTime = currentTime - step.startTime;
		const audioDuration = audio.duration * 1000;
		if (stepCurrentTime >= 0 && stepCurrentTime < audioDuration) {
			audio.currentTime = stepCurrentTime / 1000;
			// TODO this is broken in Chrome, maybe because of headers
			// https://stackoverflow.com/questions/37044064/html-audio-cant-set-currenttime
			if (audio.paused) {
				if (audioEnabled) audio.play(); // eslint-disable-line @typescript-eslint/no-floating-promises
			}
		} else if (!audio.paused) {
			audio.pause();
		}
	};

	// in dev mode, bypass the title screen for convenience
	let showTitleScreen = true;
	const proceed = () => {
		showTitleScreen = false;
	};
	const returnToTitleScreen = () => {
		if (tour) tour.cancel();
		showTitleScreen = true;
	};
	onMount(() => {
		// in dev mode, bypass the title screen for convenience
		if (devMode) {
			showTitleScreen = false;
			resources.load(); // eslint-disable-line @typescript-eslint/no-floating-promises
		}
	});
	onDestroy(() => {
		if (tour) tour.cancel();
	});

	$: inputEnabled = !tour;
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="deep-breath">
	{#if !showTitleScreen && $resources.status === 'success'}
		{#if enablePixiEarthViewer}
			<EarthViewerPixi
				{landImages}
				{seaImages}
				{activeLandValue}
				{activeSeaLevel}
				{width}
				{height}
				{x}
				{y}
				{scale}
				{moveCamera}
				{zoomCamera}
				{inputEnabled}
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
				{inputEnabled}
				{earth1LeftOffset}
				{earth2LeftOffset}
				{landImages}
				{seaImages}
				{activeLandValue}
				{activeSeaLevel}
			/>
		{/if}
		{#if tour}
			{#if showTourIntro}
				<DeepBreathTourIntro
					hide={() => (showTourIntro = false)}
					totalDuration={tourIntroTotalDuration}
					transitionInDuration={tourIntroTransitionInDuration}
					transitionOutDuration={tourIntroTransitionOutDuration}
					maxDelay={tourIntroMaxDelay}
				/>
			{/if}
			{#if showTourTitle}
				<DeepBreathTourTitle
					hide={() => (showTourTitle = false)}
					transitionDuration={tourTitleTransitionDuration}
					pauseDuration={tourTitlePauseDuration}
					maxDelay={tourTitleMaxDelay}
				/>
			{/if}
			{#if showTourCredits}
				<DeepBreathTourCredits transitionDuration={tourTitleTransitionDuration} />
			{/if}
		{/if}
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
						<FloatingTextButton on:click={beginTour}>tour</FloatingTextButton>
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
	<!-- {#if devMode}
		<div
			style="position: fixed; left: calc(50% - 3px); top: calc(50% - 3px); width: 7px; height: 7px;
			background-color: rgba(255, 50, 50, 1);"
		/>
	{/if} -->
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
