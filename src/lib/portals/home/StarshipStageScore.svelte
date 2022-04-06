<script lang="ts">
	import {FRIEND_ICONS, type StarshipStageScores} from '$lib/portals/home/starshipStage';

	export let scores: StarshipStageScores | undefined;

	// TODO ?
	// 	  '🔴',
	//   '🟠',
	// '🟡',
	//  '🟢',
	//  '🔵',
	// '🟣',
	//  '🟤',
	//   '⚫',
	//     '⚪',
	$: icons = scores
		? [scores.planet, ...scores.friends].map((f, i) => (f ? FRIEND_ICONS[i] : null)).filter(Boolean)
		: undefined;
	$: iconsStr = icons?.join(' ') ?? '';

	const copyToClipboard = (): void | Promise<void> => {
		if (icons) {
			return window.navigator.clipboard.writeText(iconsStr);
		}
	};
</script>

{#if icons}
	<div class="text" on:click={copyToClipboard}>
		{#each icons as icon}
			{icon}
		{/each}
	</div>
{/if}

<style>
	.text {
		font-size: var(--font_size_lg);
		text-align: center;
	}
</style>
