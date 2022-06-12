<script lang="ts">
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import type {StarshipStageScores} from '$lib/portals/home/starshipStage';
	import StarshipStageScore from '$lib/portals/home/StarshipStageScore.svelte';

	export let unlocked: boolean;
	export let scores: StarshipStageScores;
	// TODO refactor to an event, probably -- problem is it doesn't get attached for the anchor version
	export let onClick: ((e: MouseEvent) => void) | null = null;

	// TODO BLOCK color outline instead of font size if unlocked
</script>

<PortalPreview
	onClick={unlocked ? undefined : onClick}
	href={unlocked ? '/gravity-unlock' : undefined}
	><div style:font-size={unlocked ? 'var(--font_size_xl5)' : 'var(--font_size_xl4)'}>
		<StarshipStageScore {scores} defaultIcon="❔" />
	</div></PortalPreview
>
