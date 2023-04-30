<script lang="ts">
	import {slide} from 'svelte/transition';

	import Playlist from '$lib/music/Playlist.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import {playing_song} from '$lib/music/play_song';
	import type {PlaylistItemData, PlaylistStore as PlaylistStoreTODO} from '$lib/music/playlist';

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
</script>

<div class="player">
	<div class="content">
		<header class="centered-hz">
			<div style:flex="1">
				{#if $playing_song}
					<span>{$playing_song.song.name} - {$playing_song.song.author}</span>
				{/if}
			</div>
			<button class="icon-button" on:click={() => (collapsed = !collapsed)}
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
</style>
