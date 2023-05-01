<script lang="ts">
	import {
		to_level_data_by_name,
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
	const play_phase_sequence = async (
		phase_sequence_or_creator: PhaseSequenceOrCreator,
		jumpToPhase: PhaseData | null = null,
	): Promise<void> => {
		if (jumpToPhase && phase_sequence_or_creator === selectedPhaseSequenceOrCreator) {
			pause_audio();
		} else {
			cancel();
			selectedPhaseSequenceOrCreator = phase_sequence_or_creator;
			selectedPhaseSequence = toPhaseSequence(phase_sequence_or_creator);
			console.log(`playing phase_sequence`, phase_sequence_or_creator, selectedPhaseSequence);
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
			if (selectedPhaseSequenceOrCreator !== phase_sequence_or_creator || selectedPhase !== phase) {
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
		return play_phase_sequence(selectedPhaseSequenceOrCreator, phase);
	};
</script>

<LevelButtons {selectedPhaseSequenceOrCreator} {play_phase_sequence} {cancel} />
<!-- TODO probably render the active stage+level here -->
<div class="atlas">
	<section>
		<!-- TODO maybe have the `Level` mount the `Phase` as well -->
		<Level level={to_level_data_by_name('0')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('1')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('2')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('3')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('4')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('5')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('6')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('7')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('8')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('9')} let:phase>
			<Phase
				{phase}
				{selectPhase}
				selected={phase === selectedPhase}
				disabled={!!selectedPhaseSequence && !sequenceContains(selectedPhaseSequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('10')} let:phase>
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
