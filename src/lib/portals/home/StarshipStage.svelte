<script lang="ts">
	import World from '$lib/flat/World.svelte';
	import {Stage} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clockStore';
	import {type StageState} from '$lib/flat/stageState';

	export let width: number;
	export let height: number;
	$: console.log(`width, height`, width, height);
	export let starshipX = 0; // for reading externally
	export let starshipY = 0; // for reading externally
	export let starshipShieldRadius = 0; // for reading externally
	export let disasterAverted: boolean;
	export let exitStarshipMode: () => void;

	const clock = getClock();

	let activeStageState: StageState<Stage> | null = null;

	$: $clock, activeStageState?.stage && syncStageState(activeStageState.stage);

	// TODO this is clumsy
	const syncStageState = (stage: Stage) => {
		starshipX = stage.player.x;
		starshipY = stage.player.y;
		starshipShieldRadius = stage.player.radius;
		if (!disasterAverted) disasterAverted = stage.rockPassedFriends && stage.rockPassedPlanet;
		if (stage.controller.pressingExit) {
			exitStarshipMode();
		}
	};
</script>

<!-- TODO maybe instead use ResizeObserver? the iframe measuring feels unfortunate -->
<div class="starship-stage">
	<World {width} {height} stages={[Stage]} bind:activeStageState />
</div>

<style>
	.starship-stage {
		position: absolute !important;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		text-align: center;
		justify-content: center;
	}
</style>
