<script lang="ts">
	import {tweened, type Tweened} from 'svelte/motion';
	import {sineInOut} from 'svelte/easing';
	import {onDestroy} from 'svelte';
	import type {Writable} from 'svelte/store';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {createDeepBreathTour} from '$lib/portals/deep-breath/deepBreathTour';
	import {createTourStore, type TourData, type TourStep, type TourStore} from '$lib/app/tour';
	import {getSettings} from '$lib/app/settings';
	import {resetRenderStats, getRenderStats} from '$lib/app/renderStats';
	import {getClock} from '$lib/app/clock';

	export let tour: TourStore; // TODO BLOCK nullable?
	export let x: Writable<number>; // TODO BLOCK camera prop?
	export let y: Writable<number>;
	export let scale: Writable<number>;

	const clock = getClock();

	const settings = getSettings();
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

	const debugStartTime = 0; // ~0-300000

	const onKeyDown = (e: KeyboardEvent) => {
		if (tour) {
			if (e.key === 'Escape' && !e.ctrlKey) {
				e.stopPropagation();
				tour.cancel();
			}
		}
	};

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
		void xTween.set(xTarget, {duration, easing});
		if (!yTween) yTween = tweened($y);
		void yTween.set(yTarget, {duration, easing});
	};
	const updateScaleTween = (scaleTarget: number, duration: number, easing = sineInOut) => {
		if (!scaleTween) scaleTween = tweened($scale);
		void scaleTween.set(scaleTarget, {duration, easing});
	};
	const resetTweens = () => {
		xTween = null;
		yTween = null;
		scaleTween = null;
	};
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
						if (audioEnabled) void oceanWavesSound.audio!.play();
						return;
					}
					case 'playSong': {
						tourSong.audio!.currentTime = 0;
						if (audioEnabled) void tourSong.audio!.play();
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
				if (audioEnabled) void audio.play();
			}
		} else if (!audio.paused) {
			audio.pause();
		}
	};

	onDestroy(() => {
		if (tour) tour.cancel();
	});
</script>

<svelte:window on:keydown={onKeyDown} />

{#if showTourIntro}
	<slot
		name="intro"
		hide={() => (showTourIntro = false)}
		totalDuration={tourIntroTotalDuration}
		transitionInDuration={tourIntroTransitionInDuration}
		transitionOutDuration={tourIntroTransitionOutDuration}
		maxDelay={tourIntroMaxDelay}
	/>
{/if}
{#if showTourTitle}
	<slot
		name="title"
		hide={() => (showTourTitle = false)}
		transitionDuration={tourTitleTransitionDuration}
		pauseDuration={tourTitlePauseDuration}
		maxDelay={tourTitleMaxDelay}
	/>
{/if}
{#if showTourCredits}
	<slot name="credits" transitionDuration={tourTitleTransitionDuration} />
{/if}
