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

<div>
	<header><strong>{playlist_items.length}</strong> songs</header>
	<div class="items">
		<Playlist {playlist_items} />
	</div>
</div>

<style>
	.items {
		max-height: var(--player_max_height, 600px);
		overflow: auto;
		border: 3px var(--border_color_darker) double;
	}
</style>
