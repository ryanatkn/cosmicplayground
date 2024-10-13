<script lang="ts" strictEvents>
	import {createEventDispatcher} from 'svelte';

	import type {PlaylistItemData} from '$lib/playlist';
	import type {SongPlayState} from '$lib/play_song.js';

	const dispatch = createEventDispatcher<{
		play: PlaylistItemData;
		paused: boolean;
	}>();

	export let playlist_item: PlaylistItemData;
	export let index: number;
	export let playing_song: SongPlayState | null;
	export let paused: boolean;

	const click = async () => {
		if (playing_song && selected) {
			paused = !paused;
			dispatch('paused', paused);
		} else {
			dispatch('play', playlist_item);
		}
	};

	$: ({song} = playlist_item);
	$: current_song = playing_song?.song;
	$: selected = current_song === song;
</script>

<!-- TODO render link -->
<button type="button" class:selected class="deselectable" onclick={click}>
	<div class="count">{index + 1}</div>
	{song.name}
	<div class="author">{song.author}</div>
</button>

<style>
	button {
		--border_radius: 0;
		--border_color: var(--border_color_5);
		/* TODO set vars instead */
		background-color: var(--bg);
		/* for the z-index */
		position: relative;
		width: 100%;
		justify-content: flex-start;
		/* allow the content to shrink a lot, still needs responsive design work but isn't broken */
		min-height: var(--input_height);
	}
	button:hover {
		--border_color: var(--border_color_dark);
		z-index: 1;
	}
	button:focus,
	button.selected {
		--border_color: var(--active_color);
		z-index: 2;
	}
	button.selected {
		position: sticky;
		top: 0;
		bottom: 0;
	}
	.count {
		font-size: var(--size_sm);
		font-weight: 500;
		width: var(--space_xl3);
		display: flex;
	}
	.author {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		padding-left: var(--space_xl);
		font-size: var(--size_sm);
		font-weight: 500;
	}
</style>
