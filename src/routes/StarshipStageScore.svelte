<script lang="ts">
	import {MOON_ICONS, type StarshipStageScores} from '$routes/starshipStage';

	export let scores: StarshipStageScores | undefined;
	export let defaultIcon: string | null = null;

	$: icons = scores
		? scores.crew.map((f, i) => (f ? MOON_ICONS[i] : defaultIcon)).filter(Boolean)
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
		font-size: var(--font_size_xl4);
		text-align: center;
	}
</style>
