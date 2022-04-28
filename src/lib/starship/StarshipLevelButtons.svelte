<script lang="ts">
	import {levelSequences, type LevelSequenceOrCreator} from '$lib/starship/levels';

	export let selectedLevelSequenceOrCreator: LevelSequenceOrCreator | null = null;
	export let playLevelSequence: (levelSequenceOrCreator: LevelSequenceOrCreator) => Promise<void>;
	export let cancel: () => void;
</script>

<ul>
	{#each levelSequences as levelSequence (levelSequence)}
		<li>
			<button
				type="button"
				class:selected={levelSequence === selectedLevelSequenceOrCreator}
				on:click={() => playLevelSequence(levelSequence)}>{levelSequence.name}</button
			>
		</li>
	{/each}
</ul>
<div>
	{#if selectedLevelSequenceOrCreator}
		<button type="button" on:click={cancel}>cancel</button>
	{/if}
</div>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
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
