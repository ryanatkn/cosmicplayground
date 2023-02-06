<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {getClock} from '@feltcoop/dealt';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {createSoggyPlanetTourData} from './soggyPlanetTourData';
	import {type TourHooks, type TourData, updateAudioOnSeek, findTourStep} from '$lib/app/tour';
	import {getSettings} from '$lib/app/settings';
	import SoggyPlanetTourTitle from './SoggyPlanetTourTitle.svelte';
	import Tour from '$lib/app/Tour.svelte';
	import type Camera from '$lib/app/Camera.svelte';
	import SoggyPlanetTourCredits from './SoggyPlanetTourCredits.svelte';

	export let camera: Camera;

	// for external binding, not props
	// owned by the `Tour` component
	export let tour: Tour | undefined = undefined;
	export let touring: Writable<boolean> | undefined = undefined as any;
	export let tourData: Writable<TourData | null> | undefined = undefined as any;
	export let currentTime: Writable<number> | undefined = undefined as any;
	export let currentStepIndex: Writable<number> | undefined = undefined as any;
	export let paused: boolean | undefined = undefined as any;
	export let beginTour: (() => void) | undefined = undefined as any;
	// owned by this component
	export const showTourTitle: Writable<boolean> = writable(false);
	export const showTourCredits: Writable<boolean> = writable(false);

	let {scale} = camera;
	$: ({scale} = camera);

	const clock = getClock();

	const settings = getSettings();
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

	const tourResources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	const mainSongUrl = '/assets/audio/Alexander_Nakarada__Piña_Colada.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: mainSong = ...`
	tourResources.addResource('audio', mainSongUrl);
	let mainSong: AudioResource;
	$: mainSong = $tourResources.resources.find((r) => r.url === mainSongUrl) as any; // TODO faster API, or maybe remove (see comment above)
	const tourTitleTransitionDuration = 2000;
	const tourTitlePauseDuration = 3000;
	const tourTitleMaxDelay = 250;
	const tourTitleTotalDuration =
		tourTitleTransitionDuration * 2 + tourTitleMaxDelay + tourTitlePauseDuration;

	$: mainSongStep = $tourData && findTourStep($tourData, 'playMainSong');

	// TODO move to `Tour.svelte` after audio is moved there
	let lastPaused = paused;
	$: if ($touring && paused !== undefined && paused !== lastPaused) {
		lastPaused = paused;
		updatePaused(paused);
	}
	const updatePaused = (paused: boolean): void => {
		updateAudioOnSeek(mainSong.audio!, mainSongStep!, $currentTime!, audioEnabled, paused!);
	};

	const hooks: Partial<TourHooks> = {
		event: (name, _data) => {
			switch (name) {
				case 'load': {
					return tourResources.load(); // is idempotent
				}
				case 'playMainSong': {
					mainSong.audio!.currentTime = 0;
					if (audioEnabled) void mainSong.audio!.play();
					break;
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
			// TODO this hacky code could be replaced by adding abstractions to the tour
			// to manage things like audio and displaying specific content for a time window
			if (!mainSong.audio) throw Error('seek expects expected mainSong.audio');
			if (!mainSongStep) throw Error('seek expects mainSongStep');
			updateAudioOnSeek(mainSong.audio, mainSongStep, currentTime, audioEnabled, paused!);
			$showTourTitle = false;
			$showTourCredits = false;
		},
		done: (_completed) => {
			$showTourTitle = false;
			$showTourCredits = false;
			if ($scale > 50) $scale = 50;
			if (mainSong.audio && !mainSong.audio.paused) mainSong.audio.pause();
		},
	};
</script>

{#if $touring}
	<div class="tour">
		{#if $showTourTitle}
			<SoggyPlanetTourTitle
				hide={() => ($showTourTitle = false)}
				transitionDuration={tourTitleTransitionDuration}
				pauseDuration={tourTitlePauseDuration}
				maxDelay={tourTitleMaxDelay}
			/>
		{/if}
		{#if $showTourCredits}
			<SoggyPlanetTourCredits transitionDuration={tourTitleTransitionDuration} />
		{/if}
	</div>
{/if}
<Tour
	{camera}
	{clock}
	{hooks}
	createTourData={() => createSoggyPlanetTourData(tourTitleTotalDuration, devMode)}
	on:begin
	bind:this={tour}
	bind:touring
	bind:tourData
	bind:currentTime
	bind:currentStepIndex
	bind:paused
	bind:beginTour
/>

<style>
	.tour {
		position: fixed;
		inset: 0;
	}
</style>
