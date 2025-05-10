<script lang="ts">
	import Details from '$lib/Details.svelte';
	import {lookup_songs_by_author} from '$lib/songs.js';

	const names = ['Piña Colada', 'Winter', 'Spacey Intro', 'Spacey Outro'];

	interface Props {
		author: string;
		links?: import('svelte').Snippet;
	}

	let {author, links}: Props = $props();
	const SONG_MAX_DEFAULT_COUNT = 4;
	let songs1 = $derived(
		lookup_songs_by_author(author).sort((a, b) => {
			const a_index = names.indexOf(a.name);
			const b_index = names.indexOf(b.name);
			if (a_index === -1 && b_index === -1) return 1;
			if (a_index === -1) return 1;
			if (b_index === -1) return -1;
			return a_index - b_index;
		}),
	);
	let songs1a = $derived(songs1.slice(0, SONG_MAX_DEFAULT_COUNT));
	let songs1b = $derived(songs1.slice(SONG_MAX_DEFAULT_COUNT));
</script>

<h3>music by {author}</h3>
{@render links?.()}
{#each songs1a as song}
	<div class="audio-file">
		<a href={song.url}>"{song.name}"</a>
		<audio preload="none" controls src={song.url}></audio>
	</div>
{/each}
{#if songs1b.length}
	<Details>
		{#snippet summary()}
			<summary><h3 class="display_inline">see {songs1b.length} more songs</h3></summary>
		{/snippet}
		<div>
			{#each songs1b as song}
				<div class="audio-file">
					<a href={song.url}>"{song.name}"</a>
					<audio preload="none" controls src={song.url}></audio>
				</div>
			{/each}
		</div>
	</Details>
{/if}

<style>
	h3 {
		margin-top: var(--space_xl8) !important;
	}
	h3:nth-child(2) {
		margin-top: 0 !important;
	}
	.audio-file {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 0;
	}
	@media (max-width: 580px) {
		.audio-file {
			flex-direction: column;
		}
		.audio-file audio {
			margin-left: 0;
		}
	}
	audio {
		margin-left: 20px;
	}
</style>
