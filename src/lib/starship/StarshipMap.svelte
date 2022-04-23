<script lang="ts">
	import {
		toStageDataByName,
		type LevelData,
		type LevelSequenceOrCreator,
		sequenceContains,
		type LevelSequence,
	} from '$lib/starship/levels';
	import StarshipStage from '$lib/starship/StarshipStage.svelte';
	import StarshipLevel from '$lib/starship/StarshipLevel.svelte';
	import StarshipLevelButtons from './StarshipLevelButtons.svelte';

	// TODO refactor this so it doesn't use `bind`
	let selectedLevel: LevelData | null = null;
	let selectedLevelSequenceOrCreator: LevelSequenceOrCreator | null = null;
	let selectedLevelSequence: LevelSequence | null = null;
</script>

<div class="buttons">
	<StarshipLevelButtons
		bind:selectedLevel
		bind:selectedLevelSequenceOrCreator
		bind:selectedLevelSequence
	/>
</div>
<!-- TODO probably render the active stage+level here -->
<div class="levels">
	<section>
		<StarshipStage stage={toStageDataByName('0')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('1')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('2')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('3')} let:level>
			<StarshipLevel
				{level}
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
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('5')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('6')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('7')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('8')} let:level>
			<StarshipLevel
				{level}
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('9')} let:level>
			<StarshipLevel
				{level}
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
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('11')} let:level>
			<StarshipLevel
				{level}
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
				selected={level === selectedLevel}
				disabled={!!selectedLevelSequence && !sequenceContains(selectedLevelSequence, level)}
			/>
		</StarshipStage>
	</section>
</div>

<style>
	.buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.levels {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	section {
		display: flex;
	}
</style>
