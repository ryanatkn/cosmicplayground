<script lang="ts">
	import type {PlaylistItemData} from '$lib/music/playlist';
	import {play_song, playing_song} from '$lib/music/play_song';

	export let playlist_item: PlaylistItemData;
	export let index: number;

	const play = async () => {
		console.log(`playing playlist item`, playlist_item);
		const playState = await play_song(playlist_item.song); // TODO global player controls
		if (!playState) return;
		await playState.play;
		console.log('playing', playlist_item.song.name);
		await playState.ended;
		console.log('finished playing', playlist_item.song.name);
	};

	$: current_song = $playing_song?.song;
	$: selected = current_song === playlist_item.song;
</script>

<!-- TODO render link -->
<li class:selected role="none">
	<button class:selected class="deselectable" on:click={play}
		><small>{index + 1}</small> {playlist_item.song.name}</button
	>
</li>

<style>
	li {
		background-color: var(--bg);
	}
	li.selected {
		position: sticky;
		top: 0;
		bottom: 0;
	}
	button {
		--border_radius: 0;
		--border_color: var(--border_color_darker);
		width: 100%;
		justify-content: flex-start;
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
	small {
		margin-right: var(--spacing_md);
	}
</style>
