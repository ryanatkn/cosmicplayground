<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {getClock} from '@feltcoop/dealt';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {create_soggy_planet_tour_data} from '$routes/soggy-planet/soggy_planet_tour_data';
	import {type TourHooks, type TourData, updateAudioOnSeek, findTourStep} from '$lib/app/tour';
	import {getSettings} from '$lib/app/settings';
	import Soggy_Planet_Tour_Intro from '$routes/soggy-planet/Soggy_Planet_Tour_Intro.svelte';
	import Soggy_Planet_Tour_Title from '$routes/soggy-planet/Soggy_Planet_Tour_Title.svelte';
	import Tour from '$lib/app/Tour.svelte';
	import type Camera from '$lib/app/Camera.svelte';
	import Soggy_Planet_Tour_Credits from '$routes/soggy-planet/Soggy_Planet_Tour_Credits.svelte';

	export let camera: Camera;

	// for external binding, not props
	// owned by the `Tour` component
	export let tour: Tour | undefined = undefined;
	export let touring: Writable<boolean> | undefined = undefined as any;
	export let tour_data: Writable<TourData | null> | undefined = undefined as any;
	export let current_time: Writable<number> | undefined = undefined as any;
	export let current_step_index: Writable<number> | undefined = undefined as any;
	export let paused: boolean | undefined = undefined as any;
	export let begin_tour: (() => void) | undefined = undefined as any;
	// owned by this component
	export const show_tour_intro: Writable<boolean> = writable(false);
	export const show_tour_title: Writable<boolean> = writable(false);
	export const show_tour_credits: Writable<boolean> = writable(false);

	let {scale} = camera;
	$: ({scale} = camera);

	const clock = getClock();

	const settings = getSettings();
	$: dev_mode = $settings.devMode;
	$: audio_enabled = $settings.audioEnabled;

	const tour_resources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	const main_song_url = '/assets/audio/Alexander_Nakarada__Piña_Colada.mp3';
	const water_trickle_url = '/assets/audio/water_trickle.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: mainSong = ...`
	tour_resources.addResource('audio', main_song_url);
	tour_resources.addResource('audio', water_trickle_url);
	let main_song: AudioResource;
	$: main_song = $tour_resources.resources.find((r) => r.url === main_song_url) as any; // TODO faster API, or maybe remove (see comment above)
	let water_trickle: AudioResource;
	$: water_trickle = $tour_resources.resources.find((r) => r.url === water_trickle_url) as any; // TODO faster API, or maybe remove (see comment above)
	const tour_intro_transition_in_duration = 2000;
	const tour_intro_transition_out_duration = 2000;
	const tour_intro_pause_duration = 3000;
	const tour_intro_max_delay = 6000;
	const tour_intro_total_duration =
		tour_intro_transition_in_duration +
		tour_intro_max_delay +
		tour_intro_pause_duration +
		tour_intro_transition_out_duration;
	const tour_title_transition_duration = 2000;
	const tour_title_pause_duration = 3000;
	const tour_title_max_delay = 250;
	const tour_title_total_duration =
		tour_title_transition_duration * 2 + tour_title_max_delay + tour_title_pause_duration;

	$: main_song_step = $tour_data && findTourStep($tour_data, 'play_main_song');
	$: water_trickle_step = $tour_data && findTourStep($tour_data, 'play_water_trickle');

	// TODO move to `Tour.svelte` after audio is moved there
	let last_paused = paused;
	$: if ($touring && paused !== undefined && paused !== last_paused) {
		last_paused = paused;
		update_paused(paused);
	}
	const update_paused = (paused: boolean): void => {
		updateAudioOnSeek(main_song.audio!, main_song_step!, $current_time!, audio_enabled, paused!);
		updateAudioOnSeek(
			water_trickle.audio!,
			water_trickle_step!,
			$current_time!,
			audio_enabled,
			paused!,
		);
	};

	const hooks: Partial<TourHooks> = {
		event: (name, _data) => {
			switch (name) {
				case 'load': {
					return tour_resources.load(); // is idempotent
				}
				case 'play_main_song': {
					main_song.audio!.currentTime = 0;
					if (audio_enabled) void main_song.audio!.play();
					break;
				}
				case 'play_water_trickle': {
					water_trickle.audio!.currentTime = 0;
					if (audio_enabled) void water_trickle.audio!.play();
					return;
				}
				case 'show_intro': {
					$show_tour_intro = true;
					return;
				}
				case 'show_title': {
					$show_tour_title = true;
					return;
				}
				case 'show_credits': {
					$show_tour_credits = true;
					return;
				}
			}
			return;
		},
		seek: (currentTime, _currentStepIndex) => {
			// TODO this hacky code could be replaced by adding abstractions to the tour
			// to manage things like audio and displaying specific content for a time window
			if (!main_song.audio) throw Error('seek expects expected mainSong.audio');
			if (!main_song_step) throw Error('seek expects mainSongStep');
			updateAudioOnSeek(main_song.audio, main_song_step, currentTime, audio_enabled, paused!);
			$show_tour_intro = false;
			$show_tour_title = false;
			$show_tour_credits = false;
		},
		done: (_completed) => {
			$show_tour_intro = false;
			$show_tour_title = false;
			$show_tour_credits = false;
			if ($scale > 50) $scale = 50;
			if (main_song.audio && !main_song.audio.paused) main_song.audio.pause();
		},
	};
</script>

{#if $touring}
	<div class="tour">
		{#if $show_tour_intro}
			<Soggy_Planet_Tour_Intro
				hide={() => ($show_tour_intro = false)}
				total_duration={tour_intro_total_duration}
				transition_in_duration={tour_intro_transition_in_duration}
				transition_out_duration={tour_intro_transition_out_duration}
				max_delay={tour_intro_max_delay}
			/>
		{/if}
		{#if $show_tour_title}
			<Soggy_Planet_Tour_Title
				hide={() => ($show_tour_title = false)}
				transition_duration={tour_title_transition_duration}
				pause_duration={tour_title_pause_duration}
				max_delay={tour_title_max_delay}
			/>
		{/if}
		{#if $show_tour_credits}
			<Soggy_Planet_Tour_Credits transition_duration={tour_title_transition_duration} />
		{/if}
	</div>
{/if}
<Tour
	{camera}
	{clock}
	{hooks}
	createTourData={() =>
		create_soggy_planet_tour_data(tour_intro_total_duration, tour_title_total_duration, dev_mode)}
	on:begin
	bind:this={tour}
	bind:touring
	bind:tourData={tour_data}
	bind:currentTime={current_time}
	bind:currentStepIndex={current_step_index}
	bind:paused
	bind:beginTour={begin_tour}
/>

<style>
	.tour {
		position: fixed;
		inset: 0;
	}
</style>
