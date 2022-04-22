<script lang="ts">
	import {levelDatas} from '$lib/starship/levels';

	interface LevelSequence {
		name: string;
		sequence: string[];
	}
	const levelSequencesByName: Map<string, LevelSequence> = new Map(
		[
			{name: 'light_quick', sequence: ['0a']},
			{name: 'light_full', sequence: ['0a']},
			{name: 'light_mixed', sequence: ['0a']},
		].map((s) => [s.name, s]),
	);
	const levelSequences = Array.from(levelSequencesByName.values());

	const playLevelSequence = async (sequence: LevelSequence): Promise<void> => {
		// First stop anything that's playing.

		// Play each song in sequence.
		console.log(`sequence`, sequence);
		console.log(`levelDatas`, levelDatas);
	};
</script>

{#each levelSequences as sequence}
	<button type="button" on:click={() => playLevelSequence(sequence)}>{sequence.name}</button>
{/each}

<style>
	button {
		font-size: var(--font_size_lg);
	}
</style>
