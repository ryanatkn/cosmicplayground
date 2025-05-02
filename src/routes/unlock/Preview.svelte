<script lang="ts">
	import PortalPreview from '$lib/PortalPreview.svelte';
	import type {StarshipStageScores} from '$routes/starshipStage.js';
	import StarshipStageScore from '$routes/StarshipStageScore.svelte';

	
	interface Props {
		unlocked: boolean;
		scores: StarshipStageScores;
		// TODO refactor to an event, probably -- problem is it doesn't get attached for the anchor version
		on_click?: ((e: MouseEvent) => void) | null;
	}

	let { unlocked, scores, on_click = null }: Props = $props();
</script>

<PortalPreview
	on_click={unlocked ? undefined : on_click}
	href={unlocked ? '/unlock' : undefined}
	style={unlocked ? 'border-color: var(--photon_color)' : undefined}
	><StarshipStageScore {scores} defaultIcon="❔" /></PortalPreview
>
