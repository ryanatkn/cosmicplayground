<script lang="ts">
	import {fade, slide} from 'svelte/transition';
	import {swallow} from '@feltjs/util/dom.js';
	import {createEventDispatcher, onDestroy, onMount} from 'svelte';

	import Playlist from '$lib/Playlist.svelte';
	import type {PlaylistItemData} from '$lib/Playlist.svelte';
	import type {Song} from '$lib/music/songs';
	import type {SongPlayState} from '$lib/music/play_song';
	import type {Flavored} from '@feltjs/util';

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

	$: console.log(`playing_song`, playing_song, playing_song?.audio_el);
	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	// TODO BLOCK pause/play buttons, show currentTime progress, scrub currentTime

	$: duration = playing_song?.duration;
	$: audio_el = playing_song?.audio_el;

	// consider polling `audio_el.paused` like with `audio_el.currentTime` so we could have a `paused` local
	const pause = () => {
		// TODO BLOCK doesn't update `playing_song`
		playing_song?.audio_el?.pause();
		dispatch('pause');
	};
	const stop = () => {
		dispatch('stop', playing_song);
	};
	const resume = async () => {
		// TODO BLOCK
		void playing_song?.audio_el?.play();
		dispatch('resume');
	};
	const DOUBLE_CLICK_TIME = 0.29; // in seconds - TODO move?
	const restart_or_previous = async () => {
		if (audio_el) {
			if (audio_el.currentTime < DOUBLE_CLICK_TIME) {
				if (!playing_song) return;
				const current_song_index = songs.indexOf(playing_song.song);
				const previous_song_index =
					current_song_index === 0 ? songs.length - 1 : current_song_index - 1;
				const previous_song = songs[previous_song_index];
				dispatch('play', {song: previous_song, start_paused: audio_el?.paused});
				// TODO BLOCK this is end behavior -- if we move to an event system, we can deal with this another way
				// if (playing?.audio_el) playing.audio_el.currentTime = 0;
			} else {
				audio_el.currentTime = 0;
			}
		}
	};
	const next = async () => {
		if (!playing_song) return;
		const current_song_index = songs.indexOf(playing_song.song);
		const next_song_index = current_song_index === songs.length - 1 ? 0 : current_song_index + 1;
		const next_song = songs[next_song_index];
		dispatch('play', {song: next_song, start_paused: audio_el?.paused});
	};

	// TODO refactor? this updates the component's `current_time`, syncing to the audio element
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
	type Seconds = Flavored<number, 'Seconds'>; // TODO use this
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
			<button
				class="icon-button plain-button"
				on:click={() => (!audio_el || audio_el.paused ? resume() : pause())}
			>
				{#if !audio_el || audio_el.paused}⏵{:else}⏸{/if}
			</button>
			<!-- TODO ? <button class="icon-button plain-button" on:click={() => stop()}>⏹</button> -->
			<!-- TODO this shouldn't be needed -->
			{#if duration == null}
				<div style:flex="1" />
			{:else}
				<div class="centered-hz" style:flex="1" transition:fade|local={{duration: 133}}>
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
					<div class="duration">
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
		<Playlist {playlist_items} {collapsed} {playing_song} on:play />
		{#if !collapsed}
			<footer transition:slide|local>
				<span><strong>{playlist_items.length}</strong> songs</span>
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
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: var(--font_size_sm);
		font-weight: 600;
		width: var(--spacing_xl5);
	}
</style>
