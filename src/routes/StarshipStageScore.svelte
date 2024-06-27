<script lang="ts">
	import type {StarshipStageScores} from '$routes/starshipStage';
	import {crew} from '$routes/crew.js';

	export let scores: StarshipStageScores | undefined;
	export let defaultIcon: string | null = null;

	$: icons = scores
		? scores.crew.map((f, i) => (f ? crew[i].glyph : defaultIcon)).filter(Boolean)
		: undefined;

	// TODO ?
	// $: iconsStr = icons?.join(' ') ?? '';
	// const copyToClipboard = (): void | Promise<void> => {
	// 	if (icons) {
	// 		return window.navigator.clipboard.writeText(iconsStr);
	// 	}
	// };
</script>

{#if icons}
	<div class="text">
		{#each icons as icon}
			{icon}
		{/each}
	</div>
{/if}

<style>
	.text {
		font-size: var(--size_xl4);
		text-align: center;
	}
</style>
