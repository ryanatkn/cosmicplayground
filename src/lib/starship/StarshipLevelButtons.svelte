<script lang="ts">
	import {levelSequences, type LevelSequenceOrCreator} from '$lib/starship/levels';

	export let selectedLevelSequenceOrCreator: LevelSequenceOrCreator | null = null;
	export let playLevelSequence: (levelSequenceOrCreator: LevelSequenceOrCreator) => Promise<void>;
	export let cancel: () => void;
</script>

{#each levelSequences as levelSequence (levelSequence)}
	<button
		type="button"
		class:selected={levelSequence === selectedLevelSequenceOrCreator}
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
