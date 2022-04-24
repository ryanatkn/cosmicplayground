<script lang="ts">
	import {
		toStageDataByName,
		type LevelData,
		type LevelSequenceOrCreator,
		sequenceContains,
		type LevelSequence,
		levelDatas,
		toLevelSequence,
	} from '$lib/starship/levels';
	import StarshipStage from '$lib/starship/StarshipStage.svelte';
	import StarshipLevel from '$lib/starship/StarshipLevel.svelte';
	import StarshipLevelButtons from './StarshipLevelButtons.svelte';
	import {pauseAudio} from '$lib/audio/playAudio';
	import {playSong} from '$lib/music/playSong';

	// TODO refactor this so it doesn't use `bind`
	let selectedLevel: LevelData | null = null;
	let selectedLevelSequenceOrCreator: LevelSequenceOrCreator | null = null;
	let selectedLevelSequence: LevelSequence | null = null;

	const playLevelSong = async (level: LevelData): Promise<void> => {
		console.log(`playLevelSong`, level);
		const playState = await playSong(level.song); // TODO global player controls
		if (!playState) return;
		await playState.play;
		console.log('playing', level.name, level.song.name);
		await playState.ended;
		console.log('finished playing', level.name, level.song.name);
	};

	// TODO refactor, maybe a `LevelManager` or something
	const playLevelSequence = async (
		levelSequenceOrCreator: LevelSequenceOrCreator,
		jumpToLevel: LevelData | null = null,
	): Promise<void> => {
		if (jumpToLevel && levelSequenceOrCreator === selectedLevelSequenceOrCreator) {
			pauseAudio();
		} else {
			cancel();
			selectedLevelSequenceOrCreator = levelSequenceOrCreator;
			selectedLevelSequence = toLevelSequence(levelSequenceOrCreator);
			console.log(`playing levelSequence`, levelSequenceOrCreator, selectedLevelSequence);
		}

		const {sequence} = selectedLevelSequence!.data;

		// If trying to play a level that isn't part of the sequence,
		// cancel the sequence and just play the song.
		let remainingSequence = sequence;
		if (jumpToLevel) {
			const jumpToIndex = sequence.indexOf(jumpToLevel.name);
			if (jumpToIndex === -1) {
				cancel();
				return playLevelSong(jumpToLevel);
			}
			remainingSequence = sequence.slice(jumpToIndex);
		}

		// Play each song in sequence.
		for (const levelName of remainingSequence) {
			const level = levelDatas.get(levelName)!;
			selectedLevel = level;
			await playLevelSong(level); // eslint-disable-line no-await-in-loop
			if (selectedLevelSequenceOrCreator !== levelSequenceOrCreator || selectedLevel !== level) {
				return; // canceled or changed
			}
		}
		selectedLevel = null;
		selectedLevelSequenceOrCreator = null;
	};

	const cancel = (): void => {
		pauseAudio();
		selectedLevelSequenceOrCreator = null;
		selectedLevelSequence = null;
		selectedLevel = null;
	};

	const selectLevel = (level: LevelData) => {
		console.log(`selectLevel`, level);
		if (!selectedLevelSequenceOrCreator) {
			return playLevelSong(level);
		}
		return playLevelSequence(selectedLevelSequenceOrCreator, level);
	};
</script>

<StarshipLevelButtons {selectedLevelSequenceOrCreator} {playLevelSequence} {cancel} />
<!-- TODO probably render the active stage+level here -->
<div class="levels">
	<section>
		<StarshipStage stage={toStageDataByName('0')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('1')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('2')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('3')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<!-- TODO only 4c from 4b -->
		<StarshipStage stage={toStageDataByName('4')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('5')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('6')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('7')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('8')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('9')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<!-- TODO only 10c from 10b -->
		<StarshipStage stage={toStageDataByName('10')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('11')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<!-- TODO only 12c from 12a -->
		<StarshipStage stage={toStageDataByName('12')} let:level>
			<StarshipLevel
				{level}
				{selectLevel}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
</div>

<style>
	.levels {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	section {
		display: flex;
	}
</style>
