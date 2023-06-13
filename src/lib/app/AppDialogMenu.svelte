<script lang="ts">
	import Breadcrumbs from '@feltjs/felt-ui/Breadcrumbs.svelte';
	import {page} from '$app/stores';

	import Panel from '$lib/app/Panel.svelte';
	import AboutPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import MediaPlayer from '$lib/MediaPlayer.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';
	import {
		play_song,
		playing_song,
		stop_song,
		resume_song,
		pause_song,
		muted,
		volume,
		paused,
		shuffle,
		repeat,
	} from '$lib/music/play_song';
	import type {PlaylistItemData} from '$lib/playlist';

	const playlist_items: PlaylistItemData[] = Array.from(songs_by_name.values()).map((song) => ({
		song,
	}));

	const STORAGE_KEY_MEDIA_PLAYER_COLLAPSED = 'media_player_collapsed';
	const DEFAULT_COLLAPSED = false;
	let collapsed = loadFromStorage(STORAGE_KEY_MEDIA_PLAYER_COLLAPSED, DEFAULT_COLLAPSED);
	let last_collapsed = collapsed;
	$: if (last_collapsed !== collapsed) {
		last_collapsed = collapsed;
		setInStorage(STORAGE_KEY_MEDIA_PLAYER_COLLAPSED, collapsed);
	}

	const play = async (playlist_item: PlaylistItemData) => {
		const {song} = playlist_item;
		const playState = await play_song(song);
		if (!playState) return;
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
			playing_song={$playing_song}
			{playlist_items}
			volume={$volume}
			muted={$muted}
			paused={$paused}
			shuffle={$shuffle}
			repeat={$repeat}
			bind:collapsed
			on:play={(e) => play(e.detail)}
			on:stop={() => stop_song($playing_song)}
			on:paused={(e) => (e.detail ? pause_song($playing_song) : resume_song($playing_song))}
			on:volume={(e) => ($volume = e.detail)}
			on:muted={(e) => ($muted = e.detail)}
			on:shuffle={(e) => ($shuffle = e.detail)}
			on:repeat={(e) => ($repeat = e.detail)}
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
