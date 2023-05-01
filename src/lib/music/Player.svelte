<script lang="ts">
	import {slide} from 'svelte/transition';

	import Playlist from '$lib/music/Playlist.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import {playing_song} from '$lib/music/play_song';
	import type {PlaylistItemData, PlaylistStore as PlaylistStoreTODO} from '$lib/music/playlist';
	import {pause_audio} from '$lib/audio/play_audio';

	$: console.log(`$playing_song`, $playing_song, $playing_song?.audio_el);

	// TODO playbackRate option? https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate

	// TODO skins (inspired by winamp)

	// TODO BLOCK pause/play buttons, show currentTime progress, scrub currentTime

	export let playlist: PlaylistStoreTODO; // TODO BLOCK

	export let playlist_items: PlaylistItemData[] = Array.from(songs_by_name.values()).map(
		(song) => ({
			song,
		}),
	);
	let selected_playlist_item: PlaylistItemData | null = null;
	$: selected_playlist_item =
		($playing_song && playlist_items.find((p) => $playing_song!.song === p.song)) || null;

	export let collapsed = false;

	$: playing = !!$playing_song;
	const pause = () => {
		// TODO BLOCK doesn't update `playing_song`
		pause_audio();
	};
	const resume = () => {
		// TODO BLOCK
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
		<Playlist {playlist_items} {collapsed} />
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
