<script lang="ts">
	import {playSong} from '$lib/music/playSong';

	import {
		levelDatas,
		levelSequences,
		type LevelData,
		type LevelSequence,
	} from '$lib/starship/levels';

	const playLevelSong = async (level: LevelData): Promise<void> => {
		console.log(`level`, level);
		const playState = await playSong(level.song); // TODO global player controls
		if (!playState) {
			console.error('failed to play', playState);
			return;
		}
		await playState.play;
		console.log('playing', level.name, level.song.name);
		await playState.ended;
		console.log('finished playing', level.name, level.song.name);
	};

	const playLevelSequence = async (sequence: LevelSequence): Promise<void> => {
		// First stop anything that's playing.

		// Play each song in sequence.
		console.log(`sequence`, sequence);
		console.log(`levelDatas`, levelDatas);
		for (const levelName of sequence.sequence) {
			await playLevelSong(levelDatas.get(levelName)!); // eslint-disable-line no-await-in-loop
		}
	};
</script>

{#each levelSequences as sequence}
	<button type="button" on:click={() => playLevelSequence(sequence)}>{sequence.name}</button>
{/each}

<style>
	button {
		font-size: var(--font_size_lg);
	}
</style>
