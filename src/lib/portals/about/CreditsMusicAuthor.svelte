<script lang="ts">
	import Details from '$lib/app/Details.svelte';
	import {toSongDatasByAuthor} from '$lib/music/songs';

	export let author: string;
	const SONG_MAX_DEFAULT_COUNT = 2;
	$: songs1 = toSongDatasByAuthor(author)!;
	$: songs1a = songs1.slice(0, SONG_MAX_DEFAULT_COUNT);
	$: songs1b = songs1.slice(SONG_MAX_DEFAULT_COUNT);
</script>

<h3>music by {author}</h3>
<slot name="links" />
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
		margin-top: var(--spacing_lg);
	}
	h3:first-child {
		margin-top: 0;
	}
	.audio-file {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 0;
	}
	audio {
		margin-left: 20px;
	}
</style>
