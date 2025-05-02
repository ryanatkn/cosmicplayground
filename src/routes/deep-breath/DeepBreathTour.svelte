<script lang="ts">
	import { run } from 'svelte/legacy';

	import {writable, type Writable} from 'svelte/store';
	import {clock_context} from '$lib/clock.js';

	import {createResourcesStore, type AudioResource} from '$lib/resources.js';
	import {createDeepBreathTourData} from '$routes/deep-breath/deepBreathTourData.js';
	import {type TourHooks, type TourData, update_audio_on_seek, findTourStep} from '$lib/tour.js';
	import {settings_context} from '$lib/settings.js';
	import DeepBreathTourIntro from '$routes/deep-breath/DeepBreathTourIntro.svelte';
	import DeepBreathTourTitle from '$routes/deep-breath/DeepBreathTourTitle.svelte';
	import Tour from '$lib/Tour.svelte';
	import type Camera from '$lib/Camera.svelte';
	import DeepBreathTourCredits from '$routes/deep-breath/DeepBreathTourCredits.svelte';


	// for external binding, not props
	
	interface Props {
		camera: Camera;
		// owned by the `Tour` component
		tour?: Tour | undefined;
		touring?: Writable<boolean> | undefined;
		tourData?: Writable<TourData | null> | undefined;
		currentTime?: Writable<number> | undefined;
		currentStepIndex?: Writable<number> | undefined;
		paused?: boolean | undefined;
		begin_tour?: (() => void) | undefined;
	}

	let {
		camera,
		tour = $bindable(undefined),
		touring = $bindable(undefined as any),
		tourData = $bindable(undefined as any),
		currentTime = $bindable(undefined as any),
		currentStepIndex = $bindable(undefined as any),
		paused = $bindable(undefined as any),
		begin_tour = $bindable(undefined as any)
	}: Props = $props();
	// owned by this component
	export const showTourIntro: Writable<boolean> = writable(false);
	export const showTourTitle: Writable<boolean> = writable(false);
	export const showTourCredits: Writable<boolean> = writable(false);

	let {scale} = $state(camera);

	const clock = clock_context.get();

	const settings = settings_context.get();

	const tourResources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	const mainSongUrl = '/assets/audio/Alexander_Nakarada__Winter.mp3';
	const oceanWavesSoundUrl = '/assets/audio/ocean_waves.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: mainSong = ...`
	tourResources.addResource('audio', mainSongUrl);
	tourResources.addResource('audio', oceanWavesSoundUrl);
	let mainSong: AudioResource = $state();
	let oceanWavesSound: AudioResource = $state();
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


	// TODO move to `Tour.svelte` after audio is moved there
	let lastPaused = $state(paused);
	const updatePaused = (paused: boolean): void => {
		update_audio_on_seek(mainSong.audio!, mainSongStep!, $currentTime!, audio_enabled, paused);
		update_audio_on_seek(
			oceanWavesSound.audio!,
			oceanWavesStep!,
			$currentTime!,
			audio_enabled,
			paused,
		);
	};

	const hooks: Partial<TourHooks> = {
		event: (name, _data) => {
			switch (name) {
				case 'load': {
					return tourResources.load(); // is idempotent
				}
				case 'playOceanWavesSound': {
					oceanWavesSound.audio!.currentTime = 0;
					if (audio_enabled) void oceanWavesSound.audio!.play();
					return;
				}
				case 'play_main_song': {
					mainSong.audio!.currentTime = 0;
					if (audio_enabled) void mainSong.audio!.play();
					break;
				}
				case 'show_intro': {
					$showTourIntro = true;
					return;
				}
				case 'show_title': {
					$showTourTitle = true;
					return;
				}
				case 'show_credits': {
					$showTourCredits = true;
					return;
				}
			}
			return;
		},
		seek: (currentTime, _currentStepIndex) => {
			// TODO this hacky code could be replaced by adding abstractions to the tour
			// to manage things like audio and displaying specific content for a time window
			if (!mainSong.audio) throw Error('seek expects expected mainSong.audio');
			if (!oceanWavesSound.audio) throw Error('seek expects expected oceanWavesSound.audio');
			if (!mainSongStep) throw Error('seek expects mainSongStep');
			if (!oceanWavesStep) throw Error('seek expects oceanWavesStep');
			update_audio_on_seek(mainSong.audio, mainSongStep, currentTime, audio_enabled, paused!);
			update_audio_on_seek(
				oceanWavesSound.audio,
				oceanWavesStep,
				currentTime,
				audio_enabled,
				paused!,
			);
			$showTourIntro = false;
			$showTourTitle = false;
			$showTourCredits = false;
		},
		done: (_completed) => {
			$showTourIntro = false;
			$showTourTitle = false;
			$showTourCredits = false;
			if ($scale > 50) $scale = 50;
			if (mainSong.audio && !mainSong.audio.paused) mainSong.audio.pause();
			if (oceanWavesSound.audio && !oceanWavesSound.audio.paused) oceanWavesSound.audio.pause();
		},
	};
	run(() => {
		({scale} = camera);
	});
	let {audio_enabled, dev_mode} = $derived($settings);
	run(() => {
		mainSong = $tourResources.resources.find((r) => r.url === mainSongUrl) as any;
	}); // TODO faster API, or maybe remove (see comment above)
	run(() => {
		oceanWavesSound = $tourResources.resources.find((r) => r.url === oceanWavesSoundUrl) as any;
	}); // TODO faster API, or maybe remove (see comment above)
	let mainSongStep = $derived($tourData && findTourStep($tourData, 'play_main_song'));
	let oceanWavesStep = $derived($tourData && findTourStep($tourData, 'playOceanWavesSound'));
	run(() => {
		if ($touring && paused !== undefined && paused !== lastPaused) {
			lastPaused = paused;
			updatePaused(paused);
		}
	});
</script>

{#if $touring}
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
	create_tour_data={() =>
		createDeepBreathTourData(tourIntroTotalDuration, tourTitleTotalDuration, dev_mode)}
	on:begin
	bind:this={tour}
	bind:touring
	bind:tourData
	bind:currentTime
	bind:currentStepIndex
	bind:paused
	bind:begin_tour
/>

<style>
	.tour {
		position: fixed;
		inset: 0;
	}
</style>
