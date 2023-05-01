<script lang="ts">
	import {
		toLevelDataByName,
		type PhaseData,
		type PhaseSequenceOrCreator,
		sequenceContains,
		type PhaseSequence,
		phase_data_by_name,
		toPhaseSequence,
	} from '$routes/unlock/phases';
	import Level from '$routes/unlock/Level.svelte';
	import Phase from '$routes/unlock/Phase.svelte';
	import LevelButtons from '$routes/unlock/LevelButtons.svelte';
	import {pause_audio} from '$lib/audio/play_audio';
	import {play_song} from '$lib/music/play_song';

	// TODO refactor this so it doesn't use `bind`
	let selectedPhase: PhaseData | null = null;
	let selectedPhaseSequenceOrCreator: PhaseSequenceOrCreator | null = null;
	let selectedPhaseSequence: PhaseSequence | null = null;

	const playPhaseSong = async (phase: PhaseData): Promise<void> => {
		console.log(`playPhaseSong`, phase);
		const playState = await play_song(phase.song); // TODO global player controls
		if (!playState) return;
		await playState.play;
		console.log('playing', phase.name, phase.song.name);
		await playState.ended;
		console.log('finished playing', phase.name, phase.song.name);
	};

	// TODO refactor, maybe a `LevelManager` or something
	const playPhaseSequence = async (
		phaseSequenceOrCreator: PhaseSequenceOrCreator,
		jumpToPhase: PhaseData | null = null,
	): Promise<void> => {
		if (jumpToPhase && phaseSequenceOrCreator === selectedPhaseSequenceOrCreator) {
			pause_audio();
		} else {
			cancel();
			selectedPhaseSequenceOrCreator = phaseSequenceOrCreator;
			selectedPhaseSequence = toPhaseSequence(phaseSequenceOrCreator);
			console.log(`playing phaseSequence`, phaseSequenceOrCreator, selectedPhaseSequence);
		}

		const {sequence} = selectedPhaseSequence!.data;

		// If trying to play a level that isn't part of the sequence,
		// cancel the sequence and just play the song.
		let remainingSequence = sequence;
		if (jumpToPhase) {
			const jumpToIndex = sequence.indexOf(jumpToPhase.name);
			if (jumpToIndex === -1) {
				cancel();
				return playPhaseSong(jumpToPhase);
			}
			remainingSequence = sequence.slice(jumpToIndex);
		}

		// Play each song in sequence.
		for (const phaseName of remainingSequence) {
			const phase = phase_data_by_name.get(phaseName)!;
			selectedPhase = phase;
			await playPhaseSong(phase); // eslint-disable-line no-await-in-loop
			if (selectedPhaseSequenceOrCreator !== phaseSequenceOrCreator || selectedPhase !== phase) {
				return; // canceled or changed
			}
		}
		selectedPhase = null;
		selectedPhaseSequenceOrCreator = null;
	};

	const cancel = (): void => {
		pause_audio();
		selectedPhaseSequenceOrCreator = null;
		selectedPhaseSequence = null;
		selectedPhase = null;
	};

	const selectPhase = (phase: PhaseData) => {
		console.log(`selectPhase`, phase);
		if (!selectedPhaseSequenceOrCreator) {
			return playPhaseSong(phase);
		}
		return playPhaseSequence(selectedPhaseSequenceOrCreator, phase);
	};
</script>

<LevelButtons {selectedPhaseSequenceOrCreator} {playPhaseSequence} {cancel} />
<!-- TODO probably render the active stage+level here -->
<div class="atlas">
	<section>
		<!-- TODO maybe have the `Level` mount the `Phase` as well -->
		<Level level={toLevelDataByName('0')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('1')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('2')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('3')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('4')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('5')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('6')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('7')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('8')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('9')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('10')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={toLevelDataByName('11')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
</div>

<style>
	.atlas {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	section {
		display: flex;
	}
</style>
