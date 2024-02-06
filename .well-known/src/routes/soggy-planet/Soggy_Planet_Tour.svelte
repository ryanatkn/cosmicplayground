<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {get_clock} from '$lib/clock.js';

	import {createResourcesStore, type AudioResource} from '$lib/resources';
	import {create_soggy_planet_tour_data} from '$routes/soggy-planet/soggy_planet_tour_data';
	import {type TourHooks, type TourData, update_audio_on_seek, findTourStep} from '$lib/tour';
	import {get_settings} from '$lib/settings';
	import Tour_Text from '$lib/Tour_Text.svelte';
	import Soggy_Planet_Tour_Title from '$routes/soggy-planet/Soggy_Planet_Tour_Title.svelte';
	import Tour from '$lib/Tour.svelte';
	import type Camera from '$lib/Camera.svelte';
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
	export let update_land_images: (min: number, max: number) => void;
	export let update_daylight: (min: number, max: number) => void;
	export let update_sea_level: (min: number, max: number) => void;
	// owned by this component
	export const show_tour_intro: Writable<boolean> = writable(false);
	export const show_tour_title: Writable<boolean> = writable(false);
	export const show_tour_credits: Writable<boolean> = writable(false);

	let {scale} = camera;
	$: ({scale} = camera);

	const clock = get_clock();

	const settings = get_settings();
	$: ({audio_enabled, dev_mode} = $settings);

	const tour_resources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	const main_song_url = '/assets/audio/Alexander_Nakarada__Piña_Colada.mp3';
	const water_trickle_url = '/assets/audio/water_trickle.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: main_song = ...`
	tour_resources.addResource('audio', main_song_url);
	tour_resources.addResource('audio', water_trickle_url);
	let main_song: AudioResource;
	$: main_song = $tour_resources.resources.find((r) => r.url === main_song_url) as any; // TODO faster API, or maybe remove (see comment above)
	let water_trickle_sound: AudioResource;
	$: water_trickle_sound = $tour_resources.resources.find(
		(r) => r.url === water_trickle_url,
	) as any; // TODO faster API, or maybe remove (see comment above)
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
		if (main_song.audio && main_song_step && $current_time != null && paused != null) {
			update_audio_on_seek(main_song.audio, main_song_step, $current_time, audio_enabled, paused);
		}
		if (
			water_trickle_sound.audio &&
			water_trickle_step &&
			$current_time != null &&
			paused != null
		) {
			update_audio_on_seek(
				water_trickle_sound.audio,
				water_trickle_step,
				$current_time,
				audio_enabled,
				paused,
			);
		}
	};

	let tour_text: string[] | null = null; // TODO maybe make a store? move/refactor?
	const add_tour_text = (text: string | {content: string; count: number}): void => {
		if (typeof text === 'string') {
			tour_text = [text];
		} else {
			// TODO this is super hacky for layout reasons, bleh, just want to ship
			const v = tour_text ? tour_text.filter(Boolean) : [];
			v.push(text.content);
			while (v.length < text.count) {
				v.push('');
			}
			tour_text = v;
		}
	};

	const hooks: Partial<TourHooks> = {
		event: (name, data) => {
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
					water_trickle_sound.audio!.currentTime = 0;
					if (audio_enabled) void water_trickle_sound.audio!.play();
					return;
				}
				case 'show_text': {
					add_tour_text(data as any); // TODO type
					return;
				}
				case 'clear_text': {
					tour_text = null;
					return;
				}
				case 'show_title': {
					$show_tour_title = true;
					return;
				}
				case 'show_credits': {
					$show_tour_credits = true;
					water_trickle_sound.audio!.currentTime = 0;
					if (audio_enabled) void water_trickle_sound.audio!.play();
					return;
				}
				case 'update_land_images': {
					const {min, max} = data as any; // TODO type
					update_land_images(min, max);
					return;
				}
				case 'update_daylight': {
					const {min, max} = data as any; // TODO type
					update_daylight(min, max);
					return;
				}
				case 'update_sea_level': {
					const {min, max} = data as any; // TODO type
					update_sea_level(min, max);
					return;
				}
				default: {
					console.warn('unhandled event', name);
				}
			}
			return;
		},
		seek: (currentTime, _currentStepIndex) => {
			// TODO this hacky code could be replaced by adding abstractions to the tour
			// to manage things like audio and displaying specific content for a time window
			if (!main_song.audio) throw Error('seek expects expected main_song.audio');
			if (!water_trickle_sound.audio) throw Error('seek expects expected water_trickle.audio');
			if (!main_song_step) throw Error('seek expects main_song_step');
			if (!water_trickle_step) throw Error('seek expects water_trickleStep');
			update_audio_on_seek(main_song.audio, main_song_step, currentTime, audio_enabled, paused!);
			update_audio_on_seek(
				water_trickle_sound.audio,
				water_trickle_step,
				currentTime,
				audio_enabled,
				paused!,
			);
			tour_text = null;
			$show_tour_title = false;
			$show_tour_credits = false;
		},
		done: (_completed) => {
			tour_text = null;
			$show_tour_title = false;
			$show_tour_credits = false;
			if ($scale > 50) $scale = 50;
			update_paused(true);
		},
	};

	$: update_paused(!audio_enabled); // TODO awkward naming
</script>

{#if $touring}
	<div class="tour">
		{#if tour_text}
			<Tour_Text {tour_text} />
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
	create_tour_data={() => create_soggy_planet_tour_data(tour_title_total_duration, dev_mode)}
	on:begin
	bind:this={tour}
	bind:touring
	bind:tourData={tour_data}
	bind:currentTime={current_time}
	bind:currentStepIndex={current_step_index}
	bind:paused
	bind:begin_tour
/>

<style>
	.tour {
		position: fixed;
		inset: 0;
	}
</style>
