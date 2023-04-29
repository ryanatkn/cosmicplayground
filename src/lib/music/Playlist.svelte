<script lang="ts">
	import PlaylistItem from '$lib/music/PlaylistItem.svelte';
	import type {PlaylistItemData} from '$lib/music/playlist';

	export let playlist_items: PlaylistItemData[];
	export let selected_playlist_item: PlaylistItemData;
	export let collapsed: boolean;
</script>

<ul>
	{#if collapsed}
		<PlaylistItem
			playlist_item={selected_playlist_item}
			index={playlist_items.indexOf(selected_playlist_item)}
		/>
	{:else}
		{#each playlist_items as playlist_item, index (playlist_item)}
			<PlaylistItem {playlist_item} {index} />
		{/each}
	{/if}
</ul>
