<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {slide} from 'svelte/transition';

	import Playlist from '$lib/Playlist.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import {playing_song} from '$lib/music/play_song';
	import type {PlaylistItemData} from '$lib/Playlist.svelte';
	import {pause_audio, play_audio} from '$lib/audio/play_audio';

	$: console.log(`$playing_song`, $playing_song, $playing_song?.audio_el);
	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	// TODO BLOCK pause/play buttons, show currentTime progress, scrub currentTime

	$: playing = !!$playing_song;
	$: current_song = $playing_song?.song;

	// TODO BLOCK
	export let playlist: Playlist = undefined as any; // TODO BLOCK terrible
	$: console.log(`playlist`, playlist);

	// TODO BLOCK should we set the data in the store instead?
	export let playlist_items: Writable<PlaylistItemData[]> = writable(
		Array.from(songs_by_name.values()).map((song) => ({
			song,
		})),
	);
	let selected_playlist_item: PlaylistItemData | null = null;
	$: selected_playlist_item =
		(current_song && $playlist_items.find((p) => current_song === p.song)) || null;

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
			<div style:flex="1" style:padding-left="var(--spacing_md)" />
			<button class="icon-button plain-button" on:click={() => (collapsed = !collapsed)}
				>{#if collapsed}+{:else}−{/if}</button
			>
		</header>
		<Playlist bind:this={playlist} bind:playlist_items {collapsed} />
		{#if !collapsed}
			<footer transition:slide|local>
				<span><strong>{$playlist_items.length}</strong> songs</span>
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
