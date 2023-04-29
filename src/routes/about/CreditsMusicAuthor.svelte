<script lang="ts">
	import Details from '$lib/app/Details.svelte';
	import {lookup_songs_by_author, lookup_song} from '$lib/music/songs';

	const names = ['Piña Colada', 'Winter', 'Spacey Intro', 'Spacey Outro'];

	export let author: string;
	const SONG_MAX_DEFAULT_COUNT = 4;
	$: songs1 = lookup_songs_by_author(author)!.sort((a, b) => {
		const a_index = names.indexOf(a.name);
		const b_index = names.indexOf(b.name);
		if (a_index === -1 && b_index === -1) return 1;
		if (a_index === -1) return 1;
		if (b_index === -1) return -1;
		return a_index - b_index;
	});
	$: songs1a = songs1.slice(0, SONG_MAX_DEFAULT_COUNT);
	$: songs1b = songs1.slice(SONG_MAX_DEFAULT_COUNT);
</script>

<h3>music by {author}</h3>
<slot name="links" />
<p>
	Alexander composed <a href={lookup_song('Spacey Intro').url}>Spacey Intro</a> and
	<a href={lookup_song('Spacey Intro').url}>Spacey Outro</a> with inspiration from cosmicplayground 💚💙
</p>
{#each songs1a as song}
	<div class="audio-file">
		<a href={song.url}>"{song.name}"</a>
		<audio preload="none" controls src={song.url} />
	</div>
{/each}
{#if songs1b.length}
	<Details>
		<summary slot="summary"><h3 class="inline">see {songs1b.length} more songs</h3></summary>
		<div>
			{#each songs1b as song}
				<div class="audio-file">
					<a href={song.url}>"{song.name}"</a>
					<audio preload="none" controls src={song.url} />
				</div>
			{/each}
		</div>
	</Details>
{/if}

<style>
	h3 {
		margin-top: var(--spacing_xl8) !important;
	}
	h3:first-child {
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
