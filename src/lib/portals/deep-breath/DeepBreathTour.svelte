<script context="module" lang="ts">
	export interface DeepBreathTourManager {
		camera: Camera2;
		tour: Writable<TourStore | null>;
		tourData: Writable<TourData | null>;
		showTourIntro: Writable<boolean>;
		showTourTitle: Writable<boolean>;
		showTourCredits: Writable<boolean>;
		beginTour: () => void;
	}
</script>

<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {createEventDispatcher} from 'svelte';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {createDeepBreathTourData} from '$lib/portals/deep-breath/deepBreathTourData';
	import {createTourStore} from '$lib/app/tour';
	import {getSettings} from '$lib/app/settings';
	import {resetRenderStats, getRenderStats} from '$lib/app/renderStats';
	import {getClock} from '$lib/app/clock';
	import DeepBreathTourIntro from '$lib/portals/deep-breath/DeepBreathTourIntro.svelte';
	import DeepBreathTourTitle from '$lib/portals/deep-breath/DeepBreathTourTitle.svelte';
	import type {TourData, TourStore, TourStep} from '$lib/app/tour';
	import type {Camera2} from '$lib/app/camera2';
	import DeepBreathTourCredits from '$lib/portals/deep-breath/DeepBreathTourCredits.svelte';
	import TweenedCamera from '$lib/app/TweenedCamera.svelte';

	export let camera: Camera2;

	// for external binding, not props
	export let tourManager: DeepBreathTourManager = undefined!;

	const tour: DeepBreathTourManager['tour'] = writable(null);
	const tourData: DeepBreathTourManager['tourData'] = writable(null);
	const showTourIntro: DeepBreathTourManager['showTourIntro'] = writable(false);
	const showTourTitle: DeepBreathTourManager['showTourTitle'] = writable(false);
	const showTourCredits: DeepBreathTourManager['showTourCredits'] = writable(false);

	let tweenedCamera: TweenedCamera;

	let {scale} = camera;
	$: ({scale} = camera);

	const clock = getClock();

	const settings = getSettings();
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

	const eventDispatcher = createEventDispatcher<{begin: undefined}>();

	const debugStartTime = 0; // ~0-300000

	const onKeyDown = (e: KeyboardEvent) => {
		if ($tour) {
			if (e.key === 'Escape' && !e.ctrlKey) {
				e.stopImmediatePropagation();
				e.preventDefault();
				$tour.cancel();
			}
		}
	};

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
	const beginTour = (): void => {
		if ($tour) {
			$tour.cancel();
		}
		eventDispatcher('begin');
		if (!$tourData) {
			$tourData = createDeepBreathTourData(tourIntroTotalDuration, tourTitleTotalDuration, devMode);
		}
		const oceanWavesPlayStep = $tourData.steps.find(
			(s) => 'name' in s && s.name === 'playOceanWavesSound',
		); // TODO or get from event handler?
		const tourSongPlayStep = $tourData.steps.find((s) => 'name' in s && s.name === 'playSong'); // TODO or get from event handler?
		$tour = createTourStore($tourData, clock, {
			pan: (xTarget, yTarget, duration, easing) => {
				tweenedCamera.updatePanTweens(xTarget, yTarget, duration, easing);
			},
			zoom: (scaleTarget, duration, easing) => {
				tweenedCamera.updateScaleTween(scaleTarget, duration, easing);
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
						if (audioEnabled) void oceanWavesSound.audio!.play();
						return;
					}
					case 'playSong': {
						tourSong.audio!.currentTime = 0;
						if (audioEnabled) void tourSong.audio!.play();
						return;
					}
					case 'showIntro': {
						$showTourIntro = true;
						return;
					}
					case 'showTitle': {
						$showTourTitle = true;
						return;
					}
					case 'showCredits': {
						$showTourCredits = true;
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
				$showTourIntro = false;
				$showTourTitle = false;
				$showTourCredits = false;
			},
			done: (_completed) => {
				$tour = null;
				$showTourIntro = false;
				$showTourTitle = false;
				$showTourCredits = false;
				tweenedCamera.resetTweens();
				if ($scale > 50) $scale = 50; // TODO BLOCK is this needed?
				if (tourSong.audio && !tourSong.audio.paused) tourSong.audio.pause();
				if (oceanWavesSound.audio && !oceanWavesSound.audio.paused) oceanWavesSound.audio.pause();
				if (devMode) console.log('render stats', getRenderStats());
			},
		});
		if (devMode) {
			resetRenderStats();
			if (debugStartTime) setTimeout(() => $tour!.seekTimeTo(debugStartTime), 50);
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
				if (audioEnabled) void audio.play();
			}
		} else if (!audio.paused) {
			audio.pause();
		}
	};

	tourManager = {
		camera,
		tour,
		tourData,
		showTourIntro,
		showTourTitle,
		showTourCredits,
		beginTour,
	};
	// Make the `tourManager` reactive to `camera` changes.
	let lastCamera = camera;
	$: updateCamera(camera);
	const updateCamera = (nextCamera: Camera2): void => {
		if (lastCamera !== nextCamera) {
			tourManager = {...tourManager, camera: nextCamera};
			lastCamera = nextCamera;
		}
	};
</script>

<svelte:window on:keydown|capture={onKeyDown} />

{#if $tour}
	<div class="tour">
		{#if $showTourIntro}
			<DeepBreathTourIntro
				hide={() => ($showTourIntro = false)}
				totalDuration={tourIntroTotalDuration}
				transitionInDuration={tourIntroTransitionInDuration}
				transitionOutDuration={tourIntroTransitionOutDuration}
				maxDelay={tourIntroMaxDelay}
			/>
		{/if}
		{#if $showTourTitle}
			<DeepBreathTourTitle
				hide={() => ($showTourTitle = false)}
				transitionDuration={tourTitleTransitionDuration}
				pauseDuration={tourTitlePauseDuration}
				maxDelay={tourTitleMaxDelay}
			/>
		{/if}
		{#if $showTourCredits}
			<DeepBreathTourCredits transitionDuration={tourTitleTransitionDuration} />
		{/if}
	</div>
{/if}
<TweenedCamera {camera} bind:this={tweenedCamera} />

<style>
	.tour {
		position: fixed;
		inset: 0;
	}
</style>
