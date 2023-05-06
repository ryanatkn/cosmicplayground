<script lang="ts">
	import type {PlaylistItemData} from '$lib/Playlist.svelte';
	import type {SongPlayState} from '$lib/music/play_song';
	import type {Song} from '$lib/music/songs';

	export let playlist_item: PlaylistItemData;
	export let index: number;
	export let playing_song: SongPlayState | null;
	export let play_song: (
		song: Song,
		volume?: number,
		start_paused?: boolean,
	) => Promise<SongPlayState | undefined>;

	const play = async () => {
		console.log(`playing playlist item`, playlist_item);
		const playState = await play_song(playlist_item.song); // TODO global player controls
		if (!playState) return;
		await playState.play;
		console.log('playing', playlist_item.song.name);
		await playState.ended;
		console.log('finished playing', playlist_item.song.name);
	};

	$: current_song = playing_song?.song;
	$: selected = current_song === playlist_item.song;
</script>

<!-- TODO render link -->
<button class:selected class="deselectable" on:click={play}
	><div class="count">{index + 1}</div>
	{playlist_item.song.name}
	<div class="author">{playlist_item.song.author}</div></button
>

<style>
	button {
		--border_radius: 0;
		--border_color: var(--border_color_darker);
		/* TODO set vars instead */
		background-color: var(--bg);
		/* for the z-index */
		position: relative;
		width: 100%;
		justify-content: flex-start;
		/* allow the content to shrink a lot, still needs responsive design work but isn't broken */
		min-height: var(--button_height);
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
		font-size: var(--font_size_sm);
		font-weight: 500;
		width: var(--spacing_xl3);
		display: flex;
	}
	.author {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		padding-left: var(--spacing_xl);
		font-size: var(--font_size_sm);
		font-weight: 500;
	}
</style>
