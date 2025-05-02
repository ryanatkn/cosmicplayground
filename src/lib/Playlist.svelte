<script lang="ts" strictEvents>
	import {slide} from 'svelte/transition';
	import type {ComponentEvents} from 'svelte';

	import PlaylistItem from '$lib/PlaylistItem.svelte';
	import type {SongPlayState} from '$lib/play_song.js';
	import type {PlaylistItemData} from '$lib/playlist';

	type $$Events = ComponentEvents<PlaylistItem>;

	interface Props {
		playlist_items: PlaylistItemData[];
		collapsed: boolean;
		paused: boolean;
		playing_song: SongPlayState | null;
	}

	let {
		playlist_items,
		collapsed,
		paused,
		playing_song
	}: Props = $props();

	let current_song = $derived(playing_song?.song);
	let selected_playlist_item_index = $derived(playlist_items.findIndex((p) => p.song === current_song));
	let selected_playlist_item =
		$derived(selected_playlist_item_index === -1 ? null : playlist_items[selected_playlist_item_index]);
</script>

<!-- TODO try to hoist this, problem is getting the animation smooth -->
{#if collapsed}
	{#if selected_playlist_item}
		<div class="playlist" transition:slide|local>
			<PlaylistItem
				playlist_item={selected_playlist_item}
				index={selected_playlist_item_index}
				{paused}
				{playing_song}
				on:play
				on:paused
			/>
		</div>
	{/if}
{:else}
	<div class="playlist" transition:slide|local>
		<div class="items-wrapper">
			<ul>
				<!-- TODO add a random id and key by it -->
				{#each playlist_items as playlist_item, index (playlist_item)}
					<PlaylistItem {playlist_item} {index} {paused} {playing_song} on:play on:paused />
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style>
	.playlist {
		display: flex;
		flex-direction: column;
		border: 1px var(--border_color_5) solid;
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
