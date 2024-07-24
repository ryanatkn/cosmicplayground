<script lang="ts" strictEvents>
	import {fade, slide} from 'svelte/transition';
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {createEventDispatcher, onDestroy, onMount} from 'svelte';
	import {random_item} from '@ryanatkn/belt/random.js';
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';

	import Playlist from '$lib/Playlist.svelte';
	import VolumeControl from '$lib/VolumeControl.svelte';
	import type {PlaylistItemData} from '$lib/playlist';
	import type {SongPlayState} from '$lib/play_song.js';
	import type {Seconds} from '$lib/time';
	import type {Volume} from '$lib/audio_helpers';

	// TODO selection behavior

	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	// TODO try to not duplicate with `dispatch`
	interface $$Events {
		play: CustomEvent<PlaylistItemData>;
		stop: void;
		paused: CustomEvent<boolean>;
		volume: CustomEvent<number>;
		muted: CustomEvent<boolean>;
		shuffle: CustomEvent<boolean>;
		repeat: CustomEvent<boolean>;
	}

	const dispatch = createEventDispatcher<{
		play: PlaylistItemData;
		stop: void;
		paused: boolean;
		volume: number;
		muted: boolean;
		shuffle: boolean;
		repeat: boolean;
	}>();

	export let playing_song: SongPlayState | null;
	export let playlist_items: PlaylistItemData[];
	export let collapsed = false;
	export let paused = false; // TODO maybe make these optional, and don't set locally?
	export let volume: Volume = 1;
	export let muted = false;
	export let shuffle = false;
	export let repeat = false;

	$: console.log(`[MediaPlayer playing_song]`, playing_song, playing_song?.audio_el);
	$: has_song = !!playing_song;
	$: duration = playing_song?.duration;
	$: audio_el = playing_song?.audio_el;
	$: audio = playing_song?.audio;
	$: status = $audio?.status;

	// cache the last played song so we can resume to it for better UX
	let last_playing_song: SongPlayState | null = null;
	let ended: Promise<unknown> | null = null;
	$: if (playing_song) void update_playing_song(playing_song);
	const update_playing_song = async (p: SongPlayState | null) => {
		if (!p) {
			return;
		}
		last_playing_song = p;
		if (!p.ended || p.ended === ended) return; // TODO hacky - need to rethink the play state - will re-run when `ended` is populated
		ended = p.ended;
		await p.ended;
		if (ended !== p.ended) return;
		const next_playlist_item = repeat
			? playlist_items.find((p2) => p2.song === p.song)
			: to_next_playlist_item();
		if (next_playlist_item) dispatch('play', next_playlist_item);
	};

	const play = () => {
		if (has_song) {
			paused = !paused;
			dispatch('paused', paused);
		} else {
			const next_playlist_item = last_playing_song || to_next_playlist_item();
			if (next_playlist_item) dispatch('play', next_playlist_item);
		}
	};
	const stop = () => {
		dispatch('stop');
	};
	const DOUBLE_CLICK_TIME = 0.29; // in seconds - TODO move?
	const restart_or_previous = async () => {
		const el = audio_el || last_playing_song?.audio_el;
		if (!el || el.currentTime < DOUBLE_CLICK_TIME) {
			const previous_playlist_item = to_previous_playlist_item();
			if (previous_playlist_item) {
				dispatch('play', previous_playlist_item);
			}
		} else {
			el.currentTime = 0;
		}
	};
	const next = async () => {
		const next_playlist_item = to_next_playlist_item();
		if (next_playlist_item) {
			dispatch('play', next_playlist_item);
		}
	};

	const to_previous_playlist_item = (): PlaylistItemData | undefined => {
		if (playlist_items.length <= 1) {
			return playlist_items[0];
		}
		if (shuffle) {
			return to_random_playlist_item(playing_song || last_playing_song);
		}
		const current_index = playing_song
			? playlist_items.findIndex((p) => p.song === playing_song!.song)
			: last_playing_song
				? playlist_items.findIndex((p) => p.song === last_playing_song!.song)
				: 1;
		const previous_index = current_index === 0 ? playlist_items.length - 1 : current_index - 1;
		return playlist_items[previous_index];
	};
	const to_next_playlist_item = (): PlaylistItemData | undefined => {
		if (playlist_items.length <= 1) {
			return playlist_items[0];
		}
		if (shuffle) {
			return to_random_playlist_item(playing_song || last_playing_song);
		}
		const current_index = playing_song
			? playlist_items.findIndex((p) => p.song === playing_song!.song)
			: last_playing_song
				? playlist_items.findIndex((p) => p.song === last_playing_song!.song)
				: playlist_items.length - 1;
		const next_index = current_index === playlist_items.length - 1 ? 0 : current_index + 1;
		return playlist_items[next_index];
	};
	const to_random_playlist_item = (
		exclude_playlist_item?: PlaylistItemData | null,
	): PlaylistItemData | undefined => {
		if (playlist_items.length === 0) return undefined;
		if (playlist_items.length === 1) return playlist_items[0];
		let playlist_item: PlaylistItemData;
		do {
			playlist_item = random_item(playlist_items);
		} while (playlist_item === exclude_playlist_item);
		return playlist_item;
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

	$: show_play = !has_song || paused;
</script>

<div class="media_player">
	<div class="content">
		<header class="box row">
			<!-- https://wikipedia.org/wiki/Media_control_symbols -->
			<button
				title={show_play ? 'play' : 'pause'}
				type="button"
				class="icon_button plain"
				on:click={() => play()}
			>
				{#if show_play}
					⏵
				{:else}
					⏸
				{/if}
			</button>
			<!-- TODO transition -->
			<label class="duration box row" title="time">
				<input
					on:input={input_current_time}
					disabled={duration == null}
					class="plain"
					style:flex="1"
					type="range"
					min={0}
					max={duration ?? 1}
					step={0.01}
					value={current_time ?? 0}
				/>
				<div class="timestamp">
					{#if status === 'pending'}
						<Pending_Animation />
					{:else if duration != null}
						<div class="box" in:fade|local>
							<span>{format_time(current_time || 0)}</span><span>{format_time(duration)}</span>
						</div>
					{/if}
				</div>
			</label>
			<button
				title="restart or previous"
				type="button"
				class="icon_button plain"
				on:click={() => restart_or_previous()}
			>
				⏮
			</button>
			<button
				title="stop"
				type="button"
				class="icon_button plain"
				on:click={() => stop()}
				disabled={!has_song}
			>
				⏹
			</button>
			<button title="next" type="button" class="icon_button plain" on:click={() => next()}>
				⏭
			</button>
			<button
				title={collapsed ? 'expand' : 'collapse'}
				type="button"
				class="icon_button plain"
				on:click={() => (collapsed = !collapsed)}
				>{#if collapsed}+{:else}−{/if}</button
			>
		</header>
		<Playlist {playlist_items} {collapsed} {paused} {playing_song} on:play on:paused />
		{#if !collapsed}
			<footer transition:slide|local>
				<VolumeControl {volume} {muted} on:volume on:muted />
				<div class="box row">
					{#if repeat !== null}
						<button
							type="button"
							class="togglable icon_button plain deselectable"
							title="repeat is {repeat ? 'enabled' : 'disabled'}"
							class:selected={repeat}
							on:click={() => {
								repeat = !repeat;
								dispatch('repeat', repeat);
							}}
						>
							🔁
						</button>
					{/if}
					{#if shuffle !== null}
						<button
							type="button"
							class="togglable icon_button plain deselectable"
							title="shuffle is {shuffle ? 'enabled' : 'disabled'}"
							class:selected={shuffle}
							on:click={() => {
								shuffle = !shuffle;
								dispatch('shuffle', shuffle);
							}}
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
	.media_player {
		display: flex;
		max-height: var(--player_max_height, 360px);
		overflow: auto;
		border: var(--media_player_border);
		border-radius: var(--media_player_border_radius, var(--radius_xl4));
		padding: var(--spacing-5);
	}
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: var(--bg_light);
		border-radius: var(--media_player_border_radius, var(--radius_xl4));
	}
	header,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	header {
		padding-bottom: var(--space_xs);
	}
	footer {
		padding-top: var(--space_xs);
	}
	/* TODO should this be applied to global `.plain`? */
	button:hover {
		border: 1px solid var(--border_color_5);
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
		font-size: var(--size_sm);
		font-weight: 600;
		width: var(--space_xl5);
		color: var(--text_color_3);
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
