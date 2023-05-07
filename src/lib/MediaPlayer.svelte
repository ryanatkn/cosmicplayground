<script lang="ts">
	import {slide} from 'svelte/transition';
	import {swallow} from '@feltjs/util/dom.js';
	import {createEventDispatcher, onDestroy, onMount} from 'svelte';
	import type {Writable} from 'svelte/store';

	import Playlist from '$lib/Playlist.svelte';
	import VolumeControl from '$lib/VolumeControl.svelte';
	import type {PlaylistItemData} from '$lib/Playlist.svelte';
	import type {Song} from '$lib/music/songs';
	import type {SongPlayState} from '$lib/music/play_song';
	import type {Seconds} from '$lib/helpers';

	const dispatch = createEventDispatcher<{
		play: {song: Song; volume?: number; start_paused?: boolean};
		stop: SongPlayState | null;
		pause: SongPlayState | null;
		resume: SongPlayState | null; // TODO BLOCK maybe dont have this, use play?
	}>();

	// TODO selection behavior

	export let songs: Song[]; // TODO BLOCK maybe `media_items` and `Media` super type?
	export let playing_song: SongPlayState | null;
	export let playlist_items: PlaylistItemData[]; // TODO BLOCK compare to `songs`, maybe delete it
	export let collapsed = false;
	export let volume: Writable<number> | null = null;
	export let muted: Writable<boolean> | null = null;
	export let paused: Writable<boolean> | null = null; // TODO is a bit strange, haven't figured out best syncing patterns with the element

	$: console.log(`MediaPlayer playing_song`, playing_song, playing_song?.audio_el);
	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	$: duration = playing_song?.duration;
	$: audio_el = playing_song?.audio_el;

	$: final_paused = (paused ? $paused : audio_el?.paused) ?? false;

	// cache the last played song so we can resume to it for better UX
	let last_playing_song: SongPlayState | null = null;
	$: if (playing_song) last_playing_song = playing_song;

	const play = () => {
		if (playing_song) {
			if (!audio_el || final_paused) {
				void resume();
			} else {
				pause();
			}
		} else {
			dispatch('play', {song: last_playing_song?.song || songs[0], start_paused: final_paused});
		}
	};
	const pause = () => {
		dispatch('pause', playing_song);
	};
	const stop = () => {
		dispatch('stop', playing_song);
	};
	const resume = async () => {
		dispatch('resume', playing_song);
	};
	const DOUBLE_CLICK_TIME = 0.29; // in seconds - TODO move?
	const restart_or_previous = async () => {
		// TODO BLOCK bugged after first click after clicking `stop`
		const el = audio_el || last_playing_song?.audio_el;
		if (!el || el.currentTime < DOUBLE_CLICK_TIME) {
			const current_song_index = playing_song
				? songs.indexOf(playing_song.song)
				: last_playing_song
				? songs.indexOf(last_playing_song.song)
				: 1;
			const previous_song_index =
				current_song_index === 0 ? songs.length - 1 : current_song_index - 1;
			const previous_song = songs[previous_song_index];
			dispatch('play', {song: previous_song, start_paused: final_paused});
			// TODO BLOCK this is end behavior -- if we move to an event system, we can deal with this another way
			// el.currentTime = 0;
		} else {
			el.currentTime = 0;
		}
	};
	const next = async () => {
		const current_song_index = playing_song
			? songs.indexOf(playing_song.song)
			: last_playing_song
			? songs.indexOf(last_playing_song.song)
			: songs.length - 1;
		const next_song_index = current_song_index === songs.length - 1 ? 0 : current_song_index + 1;
		const next_song = songs[next_song_index];
		dispatch('play', {song: next_song, start_paused: final_paused});
	};

	// TODO refactor? this updates the component's `current_time`, syncing to the audio element
	// consider polling `audio_el.paused` like with `audio_el.currentTime` so we could have a `paused` local
	let current_time: number | undefined;
	let req: number;
	const sync = () => {
		current_time = audio_el?.currentTime;
		req = requestAnimationFrame(sync);
	};
	onMount(() => {
		sync();
	});
	onDestroy(() => {
		cancelAnimationFrame(req);
	});

	const input_current_time = (e: Event & {currentTarget: EventTarget & HTMLInputElement}) => {
		swallow(e);
		const t = Number(e.currentTarget.value);
		if (Number.isNaN(t)) return;
		if (audio_el) audio_el.currentTime = t;
	};

	$: has_song = !!playing_song;

	// TODO handle hours, probably want to use date-fns, but isn't currently a dependency
	// TODO refactor
	const format_time = (t: Seconds): string => {
		const m = (t / 60) | 0;
		const s = (t | 0) % 60;
		return m + ':' + (s < 10 ? '0' : '') + s;
	};
</script>

<div class="player">
	<div class="content">
		<header class="centered-hz">
			<!-- https://en.wikipedia.org/wiki/Media_control_symbols -->
			<!-- TODO what if there's `!audio_el`? -->
			<button class="icon-button plain-button" on:click={() => play()}>
				{#if !audio_el || final_paused}⏵{:else}⏸{/if}
			</button>
			<!-- TODO transition -->
			{#if duration == null}
				<div class="duration" />
			{:else}
				<div class="duration centered-hz">
					<input
						on:input={input_current_time}
						class="plain-input"
						style:flex="1"
						type="range"
						min={0}
						max={duration}
						step={0.01}
						value={current_time}
					/>
					<div class="timestamp">
						<span>{format_time(current_time || 0)}</span><span>{format_time(duration)}</span>
					</div>
				</div>
			{/if}
			<button class="icon-button plain-button" on:click={() => restart_or_previous()}>⏮</button>
			<button class="icon-button plain-button" on:click={() => stop()} disabled={!has_song}
				>⏹</button
			>
			<button class="icon-button plain-button" on:click={() => next()}>⏭</button>
			<button class="icon-button plain-button" on:click={() => (collapsed = !collapsed)}
				>{#if collapsed}+{:else}−{/if}</button
			>
		</header>
		<Playlist {playlist_items} {collapsed} {playing_song} on:play on:stop on:pause on:resume />
		{#if !collapsed}
			<footer transition:slide|local>
				{#if volume}
					<VolumeControl {volume} {muted} />
				{/if}
			</footer>
		{/if}
	</div>
</div>

<style>
	.player {
		display: flex;
		max-height: var(--player_max_height, 360px);
		overflow: auto;
		border: var(--player_border, var(--panel_border));
		border-radius: var(--player_border_radius, var(--border_radius_4));
		padding: var(--spacing-5);
	}
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: var(--bg_light);
		border-radius: var(--player_border_radius, var(--border_radius_4));
	}
	header,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	header {
		padding-bottom: var(--spacing_xs);
	}
	footer {
		padding-top: var(--spacing_xs);
	}
	/* TODO should this be applied to global `.plain-button`? */
	button:hover {
		border: 1px solid var(--border_color_darker);
	}
	button:active {
		border: 1px solid var(--active_border_color);
	}
	.duration {
		flex: 1;
		min-width: 20rem;
	}
	.timestamp {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: var(--font_size_sm);
		font-weight: 600;
		width: var(--spacing_xl5);
		color: var(--text_color_light);
	}
</style>
