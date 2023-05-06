<script lang="ts">
	import Breadcrumbs from '@feltjs/felt-ui/Breadcrumbs.svelte';
	import {page} from '$app/stores';

	import Panel from '$lib/app/Panel.svelte';
	import AboutPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import MediaPlayer from '$lib/MediaPlayer.svelte';
	import {Song, all_songs, songs_by_name} from '$lib/music/songs';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';
	import {play_song, playing_song} from '$lib/music/play_song';
	import type {PlaylistItemData} from '$lib/Playlist.svelte';

	const playlist_items: PlaylistItemData[] = Array.from(songs_by_name.values()).map((song) => ({
		song,
	}));

	const STORAGE_KEY_MEDIA_PLAYER_COLLAPSED = 'MEDIA_PLAYER_COLLAPSED';
	const DEFAULT_COLLAPSED = false;
	let collapsed = loadFromStorage(STORAGE_KEY_MEDIA_PLAYER_COLLAPSED, DEFAULT_COLLAPSED);
	let last_collapsed = collapsed;
	$: if (last_collapsed !== collapsed) {
		last_collapsed = collapsed;
		setInStorage(STORAGE_KEY_MEDIA_PLAYER_COLLAPSED, collapsed);
	}

	// TODO BLOCK extract a type and use everywhere, probably
	const play = async (options: {song: Song; volume?: number; start_paused?: boolean}) => {
		console.log(`playing`, options);
		const {song} = options;
		const playState = await play_song(song); // TODO global player controls
		if (!playState) return;
		// TODO BLOCK see `MediaPlayer` too
		// if (playState?.audio_el) playState.audio_el.currentTime = 0;
		await playState.play;
		console.log('playing', song.name);
		await playState.ended;
		console.log('finished playing', song.name);
	};
</script>

<div>
	{#if $page.url.pathname !== '/'}
		<div class="breadcrumbs">
			<Panel>
				<div class="markup centered">
					<Breadcrumbs>🌠</Breadcrumbs>
				</div>
			</Panel>
		</div>
	{/if}
	<section>
		<MediaPlayer
			on:play={(e) => play(e.detail)}
			{playlist_items}
			songs={all_songs}
			playing_song={$playing_song}
			bind:collapsed
		/>
	</section>
	<PortalPreview href="/about">
		<AboutPreview />
	</PortalPreview>
</div>

<style>
	.breadcrumbs {
		/* TODO don't hardcode */
		padding: 12px;
	}
	/* TODO hacky */
	.breadcrumbs :global(.panel) {
		margin-top: 0;
	}
	section {
		padding: var(--spacing_md);
		margin-bottom: var(--spacing_xl5);
	}
</style>
