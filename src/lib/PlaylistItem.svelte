<script lang="ts">
	import type {PlaylistItemData} from '$lib/playlist.js';
	import type {SongPlayState} from '$lib/play_song.js';

	interface Props {
		playlist_item: PlaylistItemData;
		index: number;
		playing_song: SongPlayState | null;
		paused: boolean;
		onplay: (playlist_item: PlaylistItemData) => void;
		onpause: (value: boolean) => void;
	}

	let {playlist_item, index, playing_song, paused = $bindable(), onplay, onpause}: Props = $props();

	const click = () => {
		if (playing_song && selected) {
			paused = !paused;
			onpause(paused);
		} else {
			onplay(playlist_item);
		}
	};

	const {song} = $derived(playlist_item);
	const current_song = $derived(playing_song?.song);
	const selected = $derived(current_song === song);
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
