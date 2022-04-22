<script lang="ts">
	import {pauseAudio} from '$lib/audio/playAudio';
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

	// TODO refactor these so they're props -- maybe a `LevelManager` or something
	export let selectedLevelSequence: LevelSequence | null = null;
	export let selectedLevel: LevelData | null = null;

	const playLevelSequence = async (levelSequence: LevelSequence): Promise<void> => {
		cancel();

		console.log(`playing levelSequence`, levelSequence);
		selectedLevelSequence = levelSequence;

		// Play each song in sequence.
		for (const levelName of levelSequence.sequence) {
			const level = levelDatas.get(levelName)!;
			selectedLevel = level;
			await playLevelSong(level); // eslint-disable-line no-await-in-loop
			if (selectedLevelSequence !== levelSequence || selectedLevel !== level) {
				return; // canceled or changed
			}
		}
		selectedLevel = null;
		selectedLevelSequence = null;
	};

	const cancel = (): void => {
		pauseAudio();
		selectedLevelSequence = null;
		selectedLevel = null;
	};
</script>

{#each levelSequences as levelSequence (levelSequence.name)}
	<button
		type="button"
		class:selected={levelSequence === selectedLevelSequence}
		on:click={() => playLevelSequence(levelSequence)}>{levelSequence.name}</button
	>
{/each}
<button type="button" on:click={cancel}>cancel</button>

<style>
	button {
		font-size: var(--font_size_lg);
		padding: var(--spacing_xs) var(--spacing_xs);
	}
	/* TODO refactor to be global (there are conflicting styles in places) */
	.selected {
		color: var(--pending_color);
		border-color: var(--pending_color);
	}
</style>
