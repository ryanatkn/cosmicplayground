<script lang="ts">
	import Playlist from '$lib/music/Playlist.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import type {PlaylistItemData} from './playlist';

	// TODO skins (inspired by winamp)

	export let playlist_items: PlaylistItemData[] = Array.from(songs_by_name.values()).map(
		(song) => ({
			song,
		}),
	);
</script>

<div class="player">
	<div class="content">
		<header><strong>{playlist_items.length}</strong> songs</header>
		<div class="items">
			<Playlist {playlist_items} />
		</div>
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
	.items {
		flex: 1;
		overflow: auto;
		border: 2px var(--border_color_darker) solid;
		border-radius: 2px;
	}
</style>
