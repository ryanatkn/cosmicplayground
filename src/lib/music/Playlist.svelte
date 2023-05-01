<script lang="ts">
	import {slide} from 'svelte/transition';

	import PlaylistItem from '$lib/music/PlaylistItem.svelte';
	import type {PlaylistItemData} from '$lib/music/playlist';
	import {playing_song} from './play_song';

	export let playlist_items: PlaylistItemData[];
	export let collapsed: boolean;

	$: current_song = $playing_song?.song;
	$: selected_playlist_item_index = playlist_items.findIndex((p) => p.song === current_song);
	$: selected_playlist_item =
		selected_playlist_item_index === -1 ? null : playlist_items[selected_playlist_item_index];
</script>

<!-- TODO try to hoist this, problem is getting the animation smooth -->
{#if collapsed}
	{#if selected_playlist_item}
		<div class="playlist" transition:slide|local>
			<PlaylistItem playlist_item={selected_playlist_item} index={selected_playlist_item_index} />
		</div>
	{/if}
{:else}
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
		border: 1px var(--border_color_darker) solid;
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
