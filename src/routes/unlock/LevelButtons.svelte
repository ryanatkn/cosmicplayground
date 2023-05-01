<script lang="ts">
	import {phase_sequences, type PhaseSequenceOrCreator} from '$routes/unlock/phases';

	export let selectedPhaseSequenceOrCreator: PhaseSequenceOrCreator | null = null;
	export let play_phase_sequence: (
		phase_sequence_or_creator: PhaseSequenceOrCreator,
	) => Promise<void>;
	export let cancel: () => void;
</script>

<ul>
	{#each phase_sequences as phase_sequence (phase_sequence)}
		<li role="none">
			<button
				type="button"
				class:selected={phase_sequence === selectedPhaseSequenceOrCreator}
				on:click={() => play_phase_sequence(phase_sequence)}>{phase_sequence.name}</button
			>
		</li>
	{/each}
</ul>
<div>
	{#if selectedPhaseSequenceOrCreator}
		<button type="button" on:click={cancel}>cancel</button>
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
		padding: var(--spacing_xl3) var(--spacing_xl3);
	}
	/* TODO refactor to be global (there are conflicting styles in places) */
	.selected {
		color: var(--pending_color);
		border-color: var(--pending_color);
	}
</style>
