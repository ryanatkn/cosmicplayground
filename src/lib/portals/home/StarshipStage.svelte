<script lang="ts">
	import World from '$lib/flat/World.svelte';
	import {
		PLAYER_SPEED,
		PLAYER_SPEED_BOOSTED,
		Stage,
		type StarshipStageScores,
	} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clockStore';
	import {type StageState} from '$lib/flat/stageState';

	// TODO where does this belong? see in 2 places

	export let width: number;
	export let height: number;
	export let boosterEnabled = false;
	export let starshipX = 0;
	export let starshipY = 0;
	export let currentStage: Stage | null;
	export let starshipAngle = 0;
	export let starshipShieldRadius = 0;
	export let scores: StarshipStageScores | undefined;
	export let exitStarshipMode: () => void;

	const clock = getClock();

	let activeStageState: StageState<Stage> | null = null;

	$: activeStageState?.stage && syncStageState(activeStageState.stage, $clock.dt);

	// TODO this is clumsy
	const syncStageState = (stage: Stage, _dt: number) => {
		starshipX = stage.player.x;
		starshipY = stage.player.y;

		stage.player.speed = boosterEnabled ? PLAYER_SPEED_BOOSTED : PLAYER_SPEED;

		// TODO ?
		starshipAngle = updateAngle(starshipAngle, stage.player.directionX, stage.player.directionY);
		if (!stage.freezeCamera) {
			stage.camera.update(($camera) => ({...$camera, x: starshipX, y: starshipY})); // eslint-disable-line @typescript-eslint/no-floating-promises
		}
		currentStage = stage;
		starshipShieldRadius = stage.player.radius;

		// TODO refactor - events?
		if (!scores || scoresChanged(scores, currentStage)) {
			scores = {
				friends: currentStage.friends.map((friend) => !friend.dead),
				planet: !currentStage.planet.dead,
			};
		}

		if (stage.controller.pressingExit) {
			exitStarshipMode();
		}
	};

	// TODO refactor, see usage
	const scoresChanged = (scores: StarshipStageScores, stage: Stage): boolean => {
		for (let i = 0; i < scores.friends.length; i++) {
			if (scores.friends[i] !== !stage.friends[i].dead) {
				return true;
			}
		}
		return scores.planet !== !stage.planet.dead;
	};

	const updateAngle = (currentAngle: number, directionX: number, directionY: number): number =>
		!directionX && !directionY ? currentAngle : toTargetAngle(directionX, directionY);

	const toTargetAngle = (directionX: number, directionY: number): number =>
		Math.atan2(directionY, directionX);
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
