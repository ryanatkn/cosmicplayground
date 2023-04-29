<script lang="ts">
	import type {PlaylistItemData} from '$lib/music/playlist';
	import {play_song} from '$lib/music/play_song';

	export let playlist_item: PlaylistItemData;
	export let index: number;
</script>

<!-- TODO render link -->
<li>
	<button on:click={() => play_song(playlist_item.song)}
		><small>{index}</small> {playlist_item.song.name}</button
	>
</li>

<style>
	button {
		--border_radius: 0;
		width: 100%;
		justify-content: flex-start;
		border-top: 0;
	}
	small {
		margin-right: var(--spacing_md);
	}
</style>
