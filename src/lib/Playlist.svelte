<script lang="ts" context="module">
	import {Song} from '$lib/music/songs';

	export const PlaylistItemData = z.object({
		song: Song,
	});
	export type PlaylistItemData = z.infer<typeof PlaylistItemData>;
</script>

<script lang="ts">
	import {slide} from 'svelte/transition';
	import {writable, type Writable} from 'svelte/store';
	import {z} from 'zod';

	import PlaylistItem from '$lib/PlaylistItem.svelte';
	import {playing_song} from '$lib/music/play_song';

	export let collapsed: boolean;

	export const playlist_items: Writable<PlaylistItemData[]> = writable([]);

	$: current_song = $playing_song?.song;
	$: selected_playlist_item_index = $playlist_items.findIndex((p) => p.song === current_song);
	$: selected_playlist_item =
		selected_playlist_item_index === -1 ? null : $playlist_items[selected_playlist_item_index];
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
				{#each $playlist_items as playlist_item, index (playlist_item)}
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
