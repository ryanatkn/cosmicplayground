<script lang="ts">
	import PortalPreview from '$lib/portals/home/PortalPreview.svelte';
	import {MOON_ICONS, type StarshipStageScores} from '$lib/portals/home/starshipStage';

	export let unlocked: boolean;
	export let scores: StarshipStageScores;
	// TODO refactor to an event, probably -- problem is it doesn't get attached for the anchor version
	export let onClick: ((e: MouseEvent) => void) | null = null;
</script>

<PortalPreview
	onClick={unlocked ? undefined : onClick}
	href={unlocked ? '/gravity-unlock' : undefined}
	><div style:font-size={unlocked ? 'var(--font_size_xl)' : 'var(--font_size_lg)'}>
		{#each scores.crew as crew, index}{#if crew}{MOON_ICONS[index]}{:else}❔{/if}{/each}
	</div></PortalPreview
>
