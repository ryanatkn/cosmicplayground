<script lang="ts">
	import {phase_sequences, type PhaseSequenceOrCreator} from '$routes/unlock/phases.js';

	interface Props {
		selected_phase_sequence_or_creator?: PhaseSequenceOrCreator | null;
		play_phase_sequence: (phase_sequence_or_creator: PhaseSequenceOrCreator) => Promise<void>;
		cancel: () => void;
	}

	let {selected_phase_sequence_or_creator = null, play_phase_sequence, cancel}: Props = $props();
</script>

<ul>
	{#each phase_sequences as phase_sequence (phase_sequence)}
		<li role="none">
			<button
				type="button"
				class:selected={phase_sequence === selected_phase_sequence_or_creator}
				onclick={() => play_phase_sequence(phase_sequence)}>{phase_sequence.name}</button
			>
		</li>
	{/each}
</ul>
<div>
	{#if selected_phase_sequence_or_creator}
		<button type="button" onclick={cancel}>cancel</button>
	{/if}
</div>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		flex-direction: row;
	}
	button {
		padding: var(--space_xl3) var(--space_xl3);
	}
	/* TODO refactor to be global (there are conflicting styles in places) */
	.selected {
		color: var(--pending_color);
		border-color: var(--pending_color);
	}
</style>
