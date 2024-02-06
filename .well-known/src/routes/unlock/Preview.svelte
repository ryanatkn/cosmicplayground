<script lang="ts">
	import PortalPreview from '$lib/PortalPreview.svelte';
	import type {StarshipStageScores} from '$routes/starshipStage';
	import StarshipStageScore from '$routes/StarshipStageScore.svelte';

	export let unlocked: boolean;
	export let scores: StarshipStageScores;
	// TODO refactor to an event, probably -- problem is it doesn't get attached for the anchor version
	export let on_click: ((e: MouseEvent) => void) | null = null;
</script>

<PortalPreview
	on_click={unlocked ? undefined : on_click}
	href={unlocked ? '/unlock' : undefined}
	style={unlocked ? 'border-color: var(--photon_color)' : undefined}
	><StarshipStageScore {scores} defaultIcon="❔" /></PortalPreview
>
