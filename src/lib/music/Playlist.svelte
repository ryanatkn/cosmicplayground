<script lang="ts">
	import {slide} from 'svelte/transition';

	import PlaylistItem from '$lib/music/PlaylistItem.svelte';
	import type {PlaylistItemData} from '$lib/music/playlist';

	export let playlist_items: PlaylistItemData[];
	export let selected_playlist_item: PlaylistItemData;
	export let collapsed: boolean;
</script>

<div class="playlist">
	{#if collapsed}
		<div transition:slide|local class="selected-item-wrapper">
			<PlaylistItem
				playlist_item={selected_playlist_item}
				index={playlist_items.indexOf(selected_playlist_item)}
			/>
		</div>
	{:else}
		<!-- TODO tried but failed to get this transition smoother (using a wrapper, moving the `transition:`) -->
		<div transition:slide|local class="items-wrapper">
			<ul>
				{#each playlist_items as playlist_item, index (playlist_item)}
					<PlaylistItem {playlist_item} {index} />
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.playlist {
		display: flex;
		flex-direction: column;
		border: 2px var(--border_color_darker) solid;
		border-radius: 2px;
		overflow: hidden;
	}
	.items-wrapper {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	ul {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
	}
</style>
