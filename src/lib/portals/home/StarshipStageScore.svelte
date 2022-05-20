<script lang="ts">
	import type {Writable} from 'svelte/store';

	import {MOON_ICONS, type StarshipStageScores} from '$lib/portals/home/starshipStage';

	export let scores: Writable<StarshipStageScores> | undefined;

	$: icons = scores
		? $scores!.crew.map((f, i) => (f ? MOON_ICONS[i] : null)).filter(Boolean)
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
		font-size: var(--font_size_xl4);
		text-align: center;
	}
</style>
