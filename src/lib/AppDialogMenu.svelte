<script lang="ts">
	import { run } from 'svelte/legacy';

	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {page} from '$app/state';
	import {base} from '$app/paths';

	import Panel from '$lib/Panel.svelte';
	import MediaPlayer from '$lib/MediaPlayer.svelte';
	import {songs_by_name} from '$lib/songs.js';
	import {loadFromStorage, setInStorage} from '$lib/storage.js';
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
	} from '$lib/play_song.js';
	import type {PlaylistItemData} from '$lib/playlist';
	import PortalPreview from '$lib/PortalPreview.svelte';
	import AboutPortalPreview from '$routes/about/Preview.svelte';

	const playlist_items: PlaylistItemData[] = Array.from(songs_by_name.values(), (song) => ({song}));

	const STORAGE_KEY_MEDIA_PLAYER_COLLAPSED = 'media_player_collapsed';
	const DEFAULT_COLLAPSED = false;
	let collapsed = $state(loadFromStorage(STORAGE_KEY_MEDIA_PLAYER_COLLAPSED, DEFAULT_COLLAPSED));
	let last_collapsed = $state(collapsed);
	run(() => {
		if (last_collapsed !== collapsed) {
			last_collapsed = collapsed;
			setInStorage(STORAGE_KEY_MEDIA_PLAYER_COLLAPSED, collapsed);
		}
	});

	const play = async (playlist_item: PlaylistItemData) => {
		const {song} = playlist_item;
		const playState = await play_song(song);
		if (!playState) return;
	};
</script>

<div class="app_dialog_menu">
	{#if page.url.pathname !== '/'}
		<div class="box">
			<Panel>
				<Breadcrumb>🌠</Breadcrumb>
			</Panel>
		</div>
	{/if}
	<Panel>
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
	</Panel>
	<Panel>
		<PortalPreview href="{base}/about">
			<AboutPortalPreview />
		</PortalPreview>
	</Panel>
</div>

<style>
	.app_dialog_menu {
		order: 1;
	}
</style>
