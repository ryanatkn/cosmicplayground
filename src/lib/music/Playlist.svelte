<script lang="ts">
	import {slide} from 'svelte/transition';

	import PlaylistItem from '$lib/music/PlaylistItem.svelte';
	import type {PlaylistItemData} from '$lib/music/playlist';

	export let playlist_items: PlaylistItemData[];
	export let collapsed: boolean;
</script>

{#if !collapsed}
	<div class="playlist" transition:slide|local>
		<div class="items-wrapper">
			<ul>
				{#each playlist_items as playlist_item, index (playlist_item)}
					<PlaylistItem {playlist_item} {index} />
				{/each}
			</ul>
		</div>
	</div>
{/if}

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
