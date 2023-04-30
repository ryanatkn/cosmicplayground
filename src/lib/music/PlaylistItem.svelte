<script lang="ts">
	import type {PlaylistItemData} from '$lib/music/playlist';
	import {play_song} from '$lib/music/play_song';

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
</script>

<!-- TODO render link -->
<li>
	<button on:click={play}><small>{index}</small> {playlist_item.song.name}</button>
</li>

<style>
	button {
		--border_radius: 0;
		width: 100%;
		justify-content: flex-start;
		border-top: 0;
	}
	small {
		margin-right: var(--spacing_md);
	}
</style>
