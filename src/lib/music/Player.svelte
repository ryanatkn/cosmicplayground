<script lang="ts">
	import Playlist from '$lib/music/Playlist.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import type {PlaylistItemData, Playlist as PlaylistStoreTODO} from './playlist';

	// TODO skins (inspired by winamp)

	export let playlist: PlaylistStoreTODO; // TODO BLOCK

	export let playlist_items: PlaylistItemData[] = Array.from(songs_by_name.values()).map(
		(song) => ({
			song,
		}),
	);
	export let selected_playlist_item: PlaylistItemData = playlist_items[0];

	export let collapsed = false;
</script>

<div class="player">
	<div class="content">
		<header />
		<Playlist {playlist_items} {selected_playlist_item} {collapsed} />
		<footer>
			<span><strong>{playlist_items.length}</strong> songs</span>
			<button on:click={() => (collapsed = !collapsed)}
				>{#if collapsed}+{:else}−{/if}</button
			>
		</footer>
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
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
