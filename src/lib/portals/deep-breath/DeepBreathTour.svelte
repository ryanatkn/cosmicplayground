<script lang="ts">
	import {writable, type Writable} from 'svelte/store';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {createDeepBreathTourData} from '$lib/portals/deep-breath/deepBreathTourData';
	import type {TourHooks, TourStep, TourData, TourStore} from '$lib/app/tour';
	import {getSettings} from '$lib/app/settings';
	import {getRenderStats} from '$lib/app/renderStats';
	import {getClock} from '$lib/app/clock';
	import DeepBreathTourIntro from '$lib/portals/deep-breath/DeepBreathTourIntro.svelte';
	import DeepBreathTourTitle from '$lib/portals/deep-breath/DeepBreathTourTitle.svelte';
	import Tour from '$lib/app/Tour.svelte';
	import type Camera from '$lib/app/Camera.svelte';
	import DeepBreathTourCredits from '$lib/portals/deep-breath/DeepBreathTourCredits.svelte';

	export let camera: Camera;

	// for external binding, not props
	// owned by the `Tour` component
	export let tour: Writable<TourStore | null> | undefined = undefined as any;
	export let tourData: Writable<TourData | null> | undefined = undefined as any;
	export let beginTour: (() => void) | undefined = undefined as any;
	export let updateAudioOnSeek:
		| ((audio: HTMLAudioElement, step: TourStep, currentTime: number) => void)
		| undefined = undefined as any;
	// owned by this component
	export const showTourIntro: Writable<boolean> = writable(false);
	export const showTourTitle: Writable<boolean> = writable(false);
	export const showTourCredits: Writable<boolean> = writable(false);

	let {scale} = camera;
	$: ({scale} = camera);

	const clock = getClock();

	const settings = getSettings();
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

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

	$: oceanWavesPlayStep = $tourData?.steps.find(
		(s) => 'name' in s && s.name === 'playOceanWavesSound',
	); // TODO or get from event handler?

	const hooks: Partial<TourHooks> = {
		event: (name, _data) => {
			switch (name) {
				case 'load': {
					return tourResources.load(); // is idempotent
				}
				case 'playOceanWavesSound': {
					oceanWavesSound.audio!.currentTime = 0;
					if (audioEnabled) void oceanWavesSound.audio!.play();
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
			}
			return;
		},
		seek: (currentTime, _currentStepIndex) => {
			updateAudioOnSeek!(oceanWavesSound.audio!, oceanWavesPlayStep!, currentTime);
			$showTourIntro = false;
			$showTourTitle = false;
			$showTourCredits = false;
		},
		done: (_completed) => {
			$showTourIntro = false;
			$showTourTitle = false;
			$showTourCredits = false;
			if ($scale > 50) $scale = 50;
			if (tourSong.audio && !tourSong.audio.paused) tourSong.audio.pause();
			if (oceanWavesSound.audio && !oceanWavesSound.audio.paused) oceanWavesSound.audio.pause();
			if (devMode) console.log('render stats', getRenderStats());
		},
	};
</script>

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
<Tour
	{camera}
	{clock}
	{hooks}
	createTourData={() =>
		createDeepBreathTourData(tourIntroTotalDuration, tourTitleTotalDuration, devMode)}
	bind:tour
	bind:tourData
	bind:beginTour
	bind:updateAudioOnSeek
/>

<style>
	.tour {
		position: fixed;
		inset: 0;
	}
</style>
