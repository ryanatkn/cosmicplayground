<script lang="ts">
	import type {Writable} from 'svelte/store';
	import {fade, slide} from 'svelte/transition';
	import {getClock} from '@feltcoop/dealt';
	import {swallow} from '@feltjs/util/dom.js';

	import Playlist from '$lib/Playlist.svelte';
	import {play_song, playing_song} from '$lib/music/play_song';
	import type {PlaylistItemData} from '$lib/Playlist.svelte';
	import {play_audio} from '$lib/audio/play_audio';
	import {all_songs} from '$lib/music/songs';

	$: console.log(`$playing_song`, $playing_song, $playing_song?.audio_el);
	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	// TODO BLOCK pause/play buttons, show currentTime progress, scrub currentTime

	$: current_song = $playing_song?.song;

	let playlist: Playlist;
	$: console.log(`playlist`, playlist);

	// TODO BLOCK should we set the data in the store instead?
	export let playlist_items: PlaylistItemData[];
	export let collapsed = false;

	let playlist_items_data: Writable<PlaylistItemData[]> | undefined;
	$: playlist_items_data = playlist?.playlist_items;
	$: if (playlist_items_data) $playlist_items_data = playlist_items;
	$: console.log(`$data`, $playlist_items_data);

	let selected_playlist_item: PlaylistItemData | null = null;
	$: selected_playlist_item =
		(current_song && $playlist_items_data?.find((p) => current_song === p.song)) || null;

	$: duration = $playing_song?.duration;
	$: audio_el = $playing_song?.audio_el;

	// consider polling `audio_el.paused` like with `audio_el.currentTime` so we could have a `paused` local
	const pause = () => {
		// TODO BLOCK doesn't update `playing_song`
		$playing_song?.audio_el?.pause();
	};
	const resume = async () => {
		// TODO BLOCK
		console.log(`$playing_song`, $playing_song);
		if (audio_el) {
			await play_audio(audio_el, current_time);
		}
	};
	const DOUBLE_CLICK_TIME = 0.29; // in seconds - TODO move?
	const restart_or_previous = async () => {
		if (audio_el) {
			if (audio_el.currentTime < DOUBLE_CLICK_TIME) {
				if (!$playing_song) return;
				const current_song_index = all_songs.indexOf($playing_song.song);
				const previous_song_index =
					current_song_index === 0 ? all_songs.length - 1 : current_song_index - 1;
				const previous_song = all_songs[previous_song_index];
				const playing = await play_song(previous_song, undefined, audio_el?.paused);
				if (playing?.audio_el) playing.audio_el.currentTime = 0;
			} else {
				audio_el.currentTime = 0;
			}
		}
	};
	const next = async () => {
		if (!$playing_song) return;
		const current_song_index = all_songs.indexOf($playing_song.song);
		const next_song_index =
			current_song_index === all_songs.length - 1 ? 0 : current_song_index + 1;
		const next_song = all_songs[next_song_index];
		await play_song(next_song, undefined, audio_el?.paused);
	};

	// TODO refactor? this updates the component's `current_time`, syncing to the audio element
	const clock = getClock();
	clock.resume(); // TODO BLOCK hacky
	let current_time: number | undefined;
	$: ({time} = $clock);
	$: time, (current_time = audio_el?.currentTime);

	const input_current_time = (e: Event & {currentTarget: EventTarget & HTMLInputElement}) => {
		swallow(e);
		const t = Number(e.currentTarget.value);
		if (Number.isNaN(t)) return;
		if (audio_el) audio_el.currentTime = t;
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
			<button class="icon-button plain-button" on:click={() => restart_or_previous()}>⏮</button>
			<button class="icon-button plain-button" on:click={() => next()}>⏭</button>
			<!-- TODO ? <button class="icon-button plain-button" on:click={() => stop()}>⏹</button> -->
			<!-- TODO this shouldn't be needed -->
			<div style:flex="1">
				{#if duration != null}
					<input
						transition:fade|local={{duration: 133}}
						on:input={input_current_time}
						class="plain-input"
						style:flex="1"
						type="range"
						min={0}
						max={duration}
						step={0.01}
						value={current_time}
					/>
				{/if}
			</div>
			<button class="icon-button plain-button" on:click={() => (collapsed = !collapsed)}
				>{#if collapsed}+{:else}−{/if}</button
			>
		</header>
		<Playlist bind:this={playlist} {collapsed} />
		{#if !collapsed && $playlist_items_data}
			<footer transition:slide|local>
				<span><strong>{$playlist_items_data.length}</strong> songs</span>
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
</style>
