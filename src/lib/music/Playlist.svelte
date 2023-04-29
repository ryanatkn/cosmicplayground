<script lang="ts">
	import PlaylistItem from '$lib/music/PlaylistItem.svelte';
	import type {PlaylistItemData} from '$lib/music/playlist';
	//
	export let playlist_items: PlaylistItemData[];
</script>

{#each playlist_items as playlist_item, index (playlist_item)}
	<PlaylistItem {playlist_item} {index} />
{/each}
