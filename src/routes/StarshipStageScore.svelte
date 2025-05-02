<script lang="ts">
	import type {StarshipStageScores} from '$routes/starshipStage.js';
	import {crew} from '$routes/crew.js';

	interface Props {
		scores: StarshipStageScores | undefined;
		defaultIcon?: string | null;
	}

	let {scores, defaultIcon = null}: Props = $props();

	let icons = $derived(
		scores
			? scores.crew.map((f, i) => (f ? crew[i].glyph : defaultIcon)).filter(Boolean)
			: undefined,
	);

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
