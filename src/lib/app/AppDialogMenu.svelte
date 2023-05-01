<script lang="ts">
	import Breadcrumbs from '@feltjs/felt-ui/Breadcrumbs.svelte';
	import {page} from '$app/stores';

	import Panel from '$lib/app/Panel.svelte';
	import AboutPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import MediaPlayer from '$lib/MediaPlayer.svelte';
	import {songs_by_name} from '$lib/music/songs';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';

	const playlist_items = Array.from(songs_by_name.values()).map((song) => ({
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
		<MediaPlayer {playlist_items} bind:collapsed />
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
