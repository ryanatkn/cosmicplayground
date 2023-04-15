<script lang="ts">
	import {phaseSequences, type PhaseSequenceOrCreator} from '$routes/unlock/phases';

	export let selectedPhaseSequenceOrCreator: PhaseSequenceOrCreator | null = null;
	export let playPhaseSequence: (phaseSequenceOrCreator: PhaseSequenceOrCreator) => Promise<void>;
	export let cancel: () => void;
</script>

<ul>
	{#each phaseSequences as phaseSequence (phaseSequence)}
		<li>
			<button
				type="button"
				class:selected={phaseSequence === selectedPhaseSequenceOrCreator}
				on:click={() => playPhaseSequence(phaseSequence)}>{phaseSequence.name}</button
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
