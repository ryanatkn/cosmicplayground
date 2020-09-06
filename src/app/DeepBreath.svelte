<script>
	import {tweened} from 'svelte/motion';
	import {cubicInOut, sineInOut} from 'svelte/easing';
	import {writable} from 'svelte/store';
	import {onDestroy} from 'svelte';
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';
	import {randomFloat} from '@feltcoop/gro/dist/utils/random.js';

	import DeepBreathTitleScreen from './DeepBreathTitleScreen.svelte';
	import DeepBreathZodiac from './DeepBreathZodiac.svelte';
	import DeepBreathSeaLevel from './DeepBreathSeaLevel.svelte';
	import ImageViewer from './ImageViewer.svelte';
	import BackButton from './BackButton.svelte';
	import BlendedImagesCycle from './BlendedImagesCycle.svelte';
	import BlendedImagesContinuum from './BlendedImagesContinuum.svelte';
	import {createResourcesStore} from './resourcesStore.js';
	import {createDeepBreathTour} from './deepBreathTour.js';
	import {createTourStore} from './tourStore.js';
	import TourControls from './TourControls.svelte';
	import DeepBreathTourIntro from './DeepBreathTourIntro.svelte';
	import DeepBreathTourTitle from './DeepBreathTourTitle.svelte';
	import DeepBreathTourCredits from './DeepBreathTourCredits.svelte';
	import {useSettings} from './settingsStore.js';
	import {resetRenderStats, getRenderStats} from './renderStats.js';

	export let width;
	export let height;
	export let isIdle;

	const settings = useSettings();
	let {devMode} = $settings; // needed for lexical scoping
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

	const debugStartTime = 0; // ~0-300000

	// TODO image metadata
	const imageWidth = 4096;
	const imageHeight = 2048;

	// TODO add auto pan button - share logic with Starlit Hanmmock
	// TODO show tour loading animation
	// TODO title screen - include video, improve loading visuals
	// TODO bottom+right controls - draw the curve in 2d space to create a custom loop of months+sealevel (with smoothing?)

	let showHud = true;
	const toggleHud = (value = !showHud) => {
		showHud = value;
	};

	// pan and zoom controls
	// use stores for x/y/scale so they can be easily swapped with tweens
	// TODO maybe replace all of this with a camera store?
	let x = writable(randomFloat(0, imageWidth));
	let y = writable(randomFloat(height / 2, imageHeight - height / 2)); // TODO account for different starting scale
	let scale = writable(1);
	const SCALE_FACTOR = 1.1;
	const zoomCamera = (zoomDirection, screenPivotX = width / 2, screenPivotY = height / 2) => {
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
	const moveCamera = (dx, dy) => {
		$x += dx;
		$y += dy;
	};

	export let clock;

	const onKeyDown = (e) => {
		if (tour && e.key === 'Escape') {
			tour.cancel();
			return;
		}
		if (!inputEnabled) return;
		if (e.key === 'Escape') {
			if (!e.target.closest('input')) {
				toggleHud();
			}
		}
	};

	const onClickHudToggle = (e) => {
		toggleHud();
		e.preventDefault();
		e.stopPropagation();
	};

	// Earth's land
	const landImages = Array.from({length: 12}, (_, i) => `/assets/earth/land_${i + 1}.png`);
	let cycledLandValue = 0;
	$: cycledLandIndex = Math.floor(cycledLandValue);
	let landDelay = 230;
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

	let elapsed = 0;
	$: {
		// update every clock tick
		const {dt} = $clock;

		elapsed += dt;

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

	let selectedSeaLevel = null;
	let hoveredSeaLevel = null;
	$: activeSeaLevel =
		hoveredSeaLevel === null
			? selectedSeaLevel === null
				? $seaLevel
				: selectedSeaLevel
			: hoveredSeaLevel;
	let selectedLandIndex = null;
	let hoveredLandIndex = null;
	// TODO use nullish coalescing
	$: activeLandIndex =
		hoveredLandIndex === null
			? selectedLandIndex === null
				? cycledLandIndex
				: selectedLandIndex
			: hoveredLandIndex;
	$: activeLandValue = activeLandIndex === cycledLandIndex ? cycledLandValue : activeLandIndex;

	const setCycledLandValue = (value) => {
		landTimer = landDelay * value;
	};
	const selectLandIndex = (index) => {
		selectedLandIndex = index;
		if (index !== null) setCycledLandValue(index);
	};
	const hoverLandIndex = (index) => {
		hoveredLandIndex = index;
		if (index !== null) setCycledLandValue(index);
	};
	const selectSeaLevel = (value) => {
		selectedSeaLevel = value;
	};
	const hoverSeaLevel = (value) => {
		hoveredSeaLevel = value;
	};

	$: imageViewerX = $x * -1 + width / 2;
	$: imageViewerY = $y * -1 + height / 2;

	// Make the two Earths tile seamlessly when possible.
	// We render only 2 instances as a balance between performance and UX.
	// Ideally we'd use WebGL to make rendering multiples much cheaper,
	// but that's currently out of scope for this project.
	let earth1LeftOffset;
	let earth2LeftOffset;
	$: {
		const xOffsetIndex = Math.floor($x / imageWidth);
		earth1LeftOffset = xOffsetIndex * imageWidth;
		const xOffsetOverflow = $x / imageWidth - xOffsetIndex;
		earth2LeftOffset = earth1LeftOffset + imageWidth * (xOffsetOverflow < 0.5 ? -1 : 1);
	}

	const resources = createResourcesStore();
	landImages.forEach((url) => resources.addResource('image', url));
	seaImages.forEach((url) => resources.addResource('image', url));

	let xTween;
	let yTween;
	let scaleTween;
	$: if (xTween) $x = $xTween;
	$: if (yTween) $y = $yTween;
	$: if (scaleTween) $scale = $scaleTween;
	const updatePanTweens = (xTarget, yTarget, duration, easing = sineInOut) => {
		if (!xTween) xTween = tweened($x);
		xTween.set(xTarget, {duration, easing});
		if (!yTween) yTween = tweened($y);
		yTween.set(yTarget, {duration, easing});
	};
	const updateScaleTween = (scaleTarget, duration, easing = sineInOut) => {
		if (!scaleTween) scaleTween = tweened($scale);
		scaleTween.set(scaleTarget, {duration, easing});
	};
	const resetTweens = () => {
		xTween = null;
		yTween = null;
		scaleTween = null;
	};
	let tour;
	let tourData;
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
	$: tourSong = $tourResources.resources.find((r) => r.url === tourSongUrl); // TODO faster API, or maybe remove (see comment above)
	$: oceanWavesSound = $tourResources.resources.find((r) => r.url === oceanWavesSoundUrl); // TODO faster API, or maybe remove (see comment above)
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
		if (!tourData) {
			tourData = createDeepBreathTour(tourIntroTotalDuration, tourTitleTotalDuration, devMode);
		}
		const oceanWavesPlayStep = tourData.steps.find((s) => s.name === 'playOceanWavesSound'); // TODO or get from event handler?
		const tourSongPlayStep = tourData.steps.find((s) => s.name === 'playSong'); // TODO or get from event handler?
		tour = createTourStore(tourData, clock, {
			pan: (xTarget, yTarget, duration, easing) => {
				updatePanTweens(xTarget, yTarget, duration, easing);
			},
			zoom: (scaleTarget, duration, easing) => {
				updateScaleTween(scaleTarget, duration, easing);
			},
			event: async (name, _data) => {
				if (name.startsWith('debug')) {
					console.log(name, $tour.currentTime);
					return;
				}
				switch (name) {
					case 'load': {
						return tourResources.load(); // is idempotent
					}
					case 'playOceanWavesSound': {
						oceanWavesSound.audio.currentTime = 0;
						if (audioEnabled) oceanWavesSound.audio.play();
						return;
					}
					case 'playSong': {
						tourSong.audio.currentTime = 0;
						if (audioEnabled) tourSong.audio.play();
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
				updateAudioOnSeek(oceanWavesSound.audio, oceanWavesPlayStep, currentTime);
				updateAudioOnSeek(tourSong.audio, tourSongPlayStep, currentTime);
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
			if (debugStartTime) setTimeout(() => tour.seekTimeTo(debugStartTime), 50);
		}
	};
	const updateAudioOnSeek = (audio, step, currentTime) => {
		const stepCurrentTime = currentTime - step.startTime;
		const audioDuration = audio.duration * 1000;
		if (stepCurrentTime >= 0 && stepCurrentTime < audioDuration) {
			audio.currentTime = stepCurrentTime / 1000;
			// TODO this is broken in Chrome, maybe because of headers
			// https://stackoverflow.com/questions/37044064/html-audio-cant-set-currenttime
			if (audio.paused) {
				if (audioEnabled) audio.play();
			}
		} else if (!audio.paused) {
			audio.pause();
		}
	};

	// in dev mode, bypass the title screen for convenience
	if (devMode) resources.load();
	let showTitleScreen = !devMode;
	const proceed = () => {
		showTitleScreen = false;
	};
	const returnToTitleScreen = () => {
		if (tour) tour.cancel();
		showTitleScreen = true;
	};
	onDestroy(() => {
		if (tour) tour.cancel();
	});

	$: inputEnabled = !tour;
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="deep-breath">
	{#if !showTitleScreen && $resources.status === AsyncState.Success}
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
			<div class="earths">
				<div class="earth" style="left: {earth1LeftOffset}px">
					<BlendedImagesCycle alt="Earth's land" images={landImages} value={activeLandValue} />
					<BlendedImagesContinuum alt="Earth's oceans" images={seaImages} value={activeSeaLevel} />
				</div>
				<div class="earth" style="left: {earth2LeftOffset}px">
					<BlendedImagesCycle alt="Earth's land" images={landImages} value={activeLandValue} />
					<BlendedImagesContinuum alt="Earth's oceans" images={seaImages} value={activeSeaLevel} />
				</div>
			</div>
		</ImageViewer>
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
		<div class="hud" class:idle={$isIdle}>
			<!-- TODO make these buttons, but styling is wonky -->
			{#if tour}
				<div
					class="clickable clickable-icon"
					role="button"
					aria-label="cancel tour"
					on:click={tour.cancel}
				>
					🗙
				</div>
			{:else}
				<div
					class="hud-toggle clickable"
					class:clickable--active={showHud}
					role="button"
					aria-label="toggle hud controls"
					on:click={onClickHudToggle}
				>
					...
				</div>
			{/if}
			{#if !tour || devMode}
				{#if showHud}
					<div class="hud-top-controls">
						<div
							class="clickable clickable-icon"
							role="button"
							aria-label="go back"
							on:click={returnToTitleScreen}
						>
							⇦
						</div>
						<div class="clickable" role="button" on:click={beginTour}>begin tour</div>
					</div>
					<div class="hud-left-controls">
						{#if devMode}
							<div
								class="clickable"
								role="button"
								on:click|stopPropagation|preventDefault={() => {
									$scale = Number(prompt('🔎', $scale)) || $scale;
								}}
							>
								scale: {Math.round($scale * 10) / 10}
							</div>
							<div
								class="clickable"
								role="button"
								on:click|stopPropagation|preventDefault={() => {
									const inputValue = Number(prompt('x', $x));
									if (!Number.isNaN(inputValue)) {
										$x = inputValue;
									}
								}}
							>
								x: {Math.round($x)}
							</div>
							<div
								class="clickable"
								role="button"
								on:click|stopPropagation|preventDefault={() => {
									const inputValue = Number(prompt('y', $y));
									if (!Number.isNaN(inputValue)) {
										$y = inputValue;
									}
								}}
							>
								y: {Math.round($y)}
							</div>
							{#if tour}
								<TourControls {tour} {debugStartTime} />
							{/if}
						{/if}
					</div>
					{#if !tour}
						<div class="zodiac-wrapper">
							<DeepBreathZodiac
								{activeLandIndex}
								{selectedLandIndex}
								{selectLandIndex}
								{hoverLandIndex}
							/>
						</div>
						<DeepBreathSeaLevel
							seaLevel={activeSeaLevel}
							{seaIndexMax}
							{selectedSeaLevel}
							{selectSeaLevel}
							{hoverSeaLevel}
						/>
					{/if}
				{/if}
			{/if}
		</div>
	{:else}
		<DeepBreathTitleScreen {resources} {clock} {proceed} />
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

	.hud {
		position: absolute;
		left: 0;
		top: 0;
		transition: opacity 0.5s linear;
		opacity: 1;
		display: flex;
		flex-direction: column;
		--hud-column-width: 100px;
	}
	.hud-left-controls :global(.clickable) {
		/* TODO hmm, global is a smell, `.clickable` should probably not align things */
		justify-content: flex-start;
	}
	.hud-toggle {
		padding: 0 20px 20px;
		width: var(--hud-column-width);
		height: var(--hud-column-width);
		text-align: center;
	}
	.hud-toggle.clickable.clickable--active {
		border-bottom-color: transparent;
	}
	.hud-toggle.clickable.clickable--active:hover {
		border-bottom-color: #fff;
		border-bottom-style: dotted;
	}
	.hud-toggle.clickable.clickable--active:active {
		border-bottom-style: dashed;
	}
	.hud.idle {
		opacity: 0;
	}
	.hud-top-controls {
		position: absolute;
		left: var(--hud-column-width);
		top: 0;
		display: flex;
	}
	.hud-left-controls {
		position: absolute;
		left: 0;
		top: var(--hud-column-width);
		font-size: 72px;
	}

	.zodiac-wrapper {
		/* TODO make this not fixed */
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100% - var(--hud-column-width));
	}
</style>
