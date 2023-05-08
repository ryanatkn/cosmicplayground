<script lang="ts">
	import {fade, slide} from 'svelte/transition';
	import {swallow} from '@feltjs/util/dom.js';
	import {createEventDispatcher, onDestroy, onMount} from 'svelte';
	import type {Writable} from 'svelte/store';
	import {randomItem} from '@feltjs/util/random.js';
	import PendingAnimation from '@feltjs/felt-ui/PendingAnimation.svelte';

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
	export let shuffle: Writable<boolean> | null = null;
	export let repeat: Writable<boolean> | null = null;

	$: console.log(`MediaPlayer playing_song`, playing_song, playing_song?.audio_el);
	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	$: duration = playing_song?.duration;
	$: audio_el = playing_song?.audio_el;
	$: audio = playing_song?.audio;
	$: status = $audio?.status;

	$: final_paused = (paused ? $paused : audio_el?.paused) ?? false;

	$: has_song = !!playing_song;

	// cache the last played song so we can resume to it for better UX
	let last_playing_song: SongPlayState | null = null;
	$: if (playing_song) last_playing_song = playing_song;

	const play = () => {
		if (has_song) {
			if (final_paused) {
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
			const previous_song = to_previous_song();
			if (previous_song) {
				dispatch('play', {song: previous_song, start_paused: final_paused});
			} // TODO BLOCK this is end behavior -- if we move to an event system, we can deal with this another way
			// el.currentTime = 0;
		} else {
			el.currentTime = 0;
		}
	};
	const next = async () => {
		const next_song = to_next_song();
		if (next_song) {
			dispatch('play', {song: next_song, start_paused: final_paused});
		}
	};

	const to_previous_song = (): Song | undefined => {
		if (songs.length <= 1) return songs[0];
		if ($shuffle) return to_random_song(playing_song?.song || last_playing_song?.song);
		const current_song_index = playing_song
			? songs.indexOf(playing_song.song)
			: last_playing_song
			? songs.indexOf(last_playing_song.song)
			: 1;
		const previous_song_index =
			current_song_index === 0 ? songs.length - 1 : current_song_index - 1;
		return songs[previous_song_index];
	};
	const to_next_song = (): Song | undefined => {
		if (songs.length <= 1) return songs[0];
		if ($shuffle) return to_random_song(playing_song?.song || last_playing_song?.song);
		const current_song_index = playing_song
			? songs.indexOf(playing_song.song)
			: last_playing_song
			? songs.indexOf(last_playing_song.song)
			: songs.length - 1;
		const next_song_index = current_song_index === songs.length - 1 ? 0 : current_song_index + 1;
		return songs[next_song_index];
	};

	const to_random_song = (exclude_song?: Song | null): Song | undefined => {
		if (songs.length === 0) return undefined;
		if (songs.length === 1) return songs[0];
		let song: Song;
		do {
			song = randomItem(songs);
		} while (song === exclude_song);
		return song;
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
			<button type="button" class="icon-button plain-button" on:click={() => play()}>
				{#if !has_song || final_paused}
					⏵
				{:else}
					⏸
				{/if}
			</button>
			<!-- TODO transition -->
			<div class="duration centered-hz">
				<input
					on:input={input_current_time}
					disabled={duration == null}
					class="plain-input"
					style:flex="1"
					type="range"
					min={0}
					max={duration ?? 1}
					step={0.01}
					value={current_time ?? 0}
				/>
				<div class="timestamp">
					{#if status === 'pending'}
						<PendingAnimation />
					{:else if duration != null}
						<div in:fade|local>
							<span>{format_time(current_time || 0)}</span><span>{format_time(duration)}</span>
						</div>
					{/if}
				</div>
			</div>
			<button type="button" class="icon-button plain-button" on:click={() => restart_or_previous()}>
				⏮
			</button>
			<button
				type="button"
				class="icon-button plain-button"
				on:click={() => stop()}
				disabled={!has_song}
			>
				⏹
			</button>
			<button type="button" class="icon-button plain-button" on:click={() => next()}> ⏭ </button>
			<button
				type="button"
				class="icon-button plain-button"
				on:click={() => (collapsed = !collapsed)}
				>{#if collapsed}+{:else}−{/if}</button
			>
		</header>
		<Playlist {playlist_items} {collapsed} {playing_song} on:play on:stop on:pause on:resume />
		{#if !collapsed}
			<footer transition:slide|local>
				{#if volume}
					<VolumeControl {volume} {muted} />
				{/if}
				<div class="centered-hz">
					{#if repeat}
						<button
							type="button"
							class="togglable icon-button plain-button deselectable"
							title="repeat is {$repeat ? 'enabled' : 'disabled'}"
							class:selected={$repeat}
							on:click={() => ($repeat = !$repeat)}
						>
							🔁
						</button>
					{/if}
					{#if shuffle}
						<button
							type="button"
							class="togglable icon-button plain-button deselectable"
							title="shuffle is {$shuffle ? 'enabled' : 'disabled'}"
							class:selected={$shuffle}
							on:click={() => ($shuffle = !$shuffle)}
						>
							🔀
						</button>
					{/if}
				</div>
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
	/* TODO move to style.css?  */
	.togglable {
		filter: grayscale();
	}
	.togglable.selected {
		filter: none;
		/* TODO probably do this differently */
		font-size: 114%;
	}
</style>
