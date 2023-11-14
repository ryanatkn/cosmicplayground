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
	import {pause_audio} from '$lib/play_audio';
	import {play_song} from '$lib/play_song';

	// TODO refactor this so it doesn't use `bind`
	let selected_phase: PhaseData | null = null;
	let selected_phase_sequence_or_creator: PhaseSequenceOrCreator | null = null;
	let selected_phase_sequence: PhaseSequence | null = null;

	const play_phase_song = async (phase: PhaseData): Promise<void> => {
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
		jump_to_phase: PhaseData | null = null,
	): Promise<void> => {
		if (jump_to_phase && phase_sequence_or_creator === selected_phase_sequence_or_creator) {
			pause_audio();
		} else {
			cancel();
			selected_phase_sequence_or_creator = phase_sequence_or_creator;
			selected_phase_sequence = toPhaseSequence(phase_sequence_or_creator);
			console.log(`playing phase_sequence`, phase_sequence_or_creator, selected_phase_sequence);
		}

		const {sequence} = selected_phase_sequence!.data;

		// If trying to play a level that isn't part of the sequence,
		// cancel the sequence and just play the song.
		let remaining_sequence = sequence;
		if (jump_to_phase) {
			const jumpToIndex = sequence.indexOf(jump_to_phase.name);
			if (jumpToIndex === -1) {
				cancel();
				return play_phase_song(jump_to_phase);
			}
			remaining_sequence = sequence.slice(jumpToIndex);
		}

		// Play each song in sequence.
		for (const phase_name of remaining_sequence) {
			const phase = phase_data_by_name.get(phase_name)!;
			selected_phase = phase;
			await play_phase_song(phase); // eslint-disable-line no-await-in-loop
			if (
				selected_phase_sequence_or_creator !== phase_sequence_or_creator ||
				selected_phase !== phase
			) {
				return; // canceled or changed
			}
		}
		selected_phase = null;
		selected_phase_sequence_or_creator = null;
	};

	const cancel = (): void => {
		pause_audio();
		selected_phase_sequence_or_creator = null;
		selected_phase_sequence = null;
		selected_phase = null;
	};

	const select_phase = (phase: PhaseData) => {
		console.log(`select_phase`, phase);
		if (!selected_phase_sequence_or_creator) {
			return play_phase_song(phase);
		}
		return play_phase_sequence(selected_phase_sequence_or_creator, phase);
	};
</script>

<LevelButtons {selected_phase_sequence_or_creator} {play_phase_sequence} {cancel} />
<!-- TODO probably render the active stage+level here -->
<div class="atlas">
	<section>
		<!-- TODO maybe have the `Level` mount the `Phase` as well -->
		<Level level={to_level_data_by_name('0')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('1')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('2')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('3')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('4')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('5')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('6')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('7')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('8')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('9')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
			/>
		</Level>
	</section>
	<section>
		<Level level={to_level_data_by_name('10')} let:phase>
			<Phase
				{phase}
				{select_phase}
				selected={phase === selected_phase}
				disabled={!!selected_phase_sequence && !sequenceContains(selected_phase_sequence, phase)}
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
