<script lang="ts">
	import type {Writable} from 'svelte/store';
	import {slide} from 'svelte/transition';
	import {getClock} from '@feltcoop/dealt';

	import Playlist from '$lib/Playlist.svelte';
	import {playing_song} from '$lib/music/play_song';
	import type {PlaylistItemData} from '$lib/Playlist.svelte';
	import {pause_audio, play_audio} from '$lib/audio/play_audio';

	$: console.log(`$playing_song`, $playing_song, $playing_song?.audio_el);
	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	// TODO BLOCK pause/play buttons, show currentTime progress, scrub currentTime

	$: playing = !!$playing_song;
	$: current_song = $playing_song?.song;

	let playlist: Playlist;
	$: console.log(`playlist`, playlist);

	// TODO BLOCK should we set the data in the store instead?
	export let playlist_items: PlaylistItemData[];

	let playlist_items_data: Writable<PlaylistItemData[]> | undefined;
	$: playlist_items_data = playlist?.playlist_items;
	$: if (playlist_items_data) $playlist_items_data = playlist_items;
	$: console.log(`$data`, $playlist_items_data);

	let selected_playlist_item: PlaylistItemData | null = null;
	$: selected_playlist_item =
		(current_song && $playlist_items_data?.find((p) => current_song === p.song)) || null;

	$: duration = $playing_song?.duration;
	$: audio_el = $playing_song?.audio_el;
	$: console.log(`audio_el`, audio_el?.currentTime);

	export let collapsed = false;

	const pause = () => {
		// TODO BLOCK doesn't update `playing_song`
		pause_audio();
		// HTMLMediaElement
	};
	const resume = () => {
		// TODO BLOCK
		const audio_el = $playing_song?.audio_el;
		console.log(`$playing_song`, $playing_song);
		if (audio_el) void play_audio(audio_el);
	};
	const restart = () => {
		// TODO BLOCK
	};
	const next = () => {
		// TODO BLOCK
	};

	// TODO refactor? this updates the component's `current_time`, syncing to the audio element
	const clock = getClock();
	clock.resume(); // TODO BLOCK hacky
	let current_time: number | undefined;
	$: ({time} = $clock);
	$: time, (current_time = audio_el?.currentTime);
</script>

<div class="player">
	<div class="content">
		<header class="centered-hz">
			<!-- https://en.wikipedia.org/wiki/Media_control_symbols -->
			<button class="icon-button plain-button" on:click={() => (playing ? pause() : resume())}>
				{#if playing}⏸{:else}⏵{/if}
			</button>
			<button class="icon-button plain-button" on:click={() => restart()}>⏮</button>
			<!-- TODO ? <button class="icon-button plain-button" on:click={() => stop()}>⏹</button> -->
			<button class="icon-button plain-button" on:click={() => next()}>⏭</button>
			{#if duration != null}
				<input
					class="plain-input"
					type="range"
					min={0}
					max={duration}
					step={0.01}
					value={current_time}
				/>
			{:else}
				<div style:flex="1" />
			{/if}
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
