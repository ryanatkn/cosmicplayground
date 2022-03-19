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
	import {getIdle} from '$lib/app/trackIdleState';
	import InteractiveSurface from '$lib/flat/InteractiveSurface.svelte';

	export let screenWidth: number;
	export let screenHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let worldWidth: number;
	export let worldHeight: number;
	export let boosterEnabled = false;
	export let starshipX = 0;
	export let starshipY = 0;
	export let currentStage: Stage | null;
	export let starshipAngle = 0;
	export let starshipShieldRadius = 0;
	export let scores: StarshipStageScores | undefined;
	export let finish: () => void;
	export let exit: () => void;

	const clock = getClock();

	const idle = getIdle();
	$: if ($idle) clock.pause();

	let activeStageState: StageState<Stage> | null = null;

	$: currentStage = activeStageState?.stage ?? null;
	$: currentStage && syncStageState(currentStage, $clock.dt);

	let elapsed = 0;
	let finished = false;
	const STAGE_DURATION = 30000;

	// TODO this is clumsy
	const syncStageState = (stage: Stage, dt: number) => {
		elapsed += dt;
		if (!finished && elapsed > STAGE_DURATION) {
			finished = true;
			finish();
		}

		starshipX = stage.player.x;
		starshipY = stage.player.y;

		stage.player.speed = boosterEnabled ? PLAYER_SPEED_BOOSTED : PLAYER_SPEED;

		// TODO ?
		stage.controller.viewScale = viewWidth / worldWidth; // TODO where does this go?
		starshipAngle = updateAngle(starshipAngle, stage.player.directionX, stage.player.directionY);
		if (!stage.freezeCamera) {
			stage.camera.update(($camera) => ({...$camera, x: starshipX, y: starshipY})); // eslint-disable-line @typescript-eslint/no-floating-promises
		}
		starshipShieldRadius = stage.player.radius;

		// TODO refactor - events?
		if (!scores || scoresChanged(scores, stage)) {
			scores = {
				friends: stage.friends.map((friend) => !friend.dead),
				planet: !stage.planet.dead,
			};
		}

		if (stage.controller.pressingExit) {
			exit();
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

	$: transform = computeWorldTransform(viewWidth, viewHeight, worldWidth, worldHeight);

	// TODO BLOCK dont's scale the canvas -- also is this where the transform belongs, or should it be in `World` or even `index.svelte`?
	const computeWorldTransform = (
		viewWidth: number,
		viewHeight: number,
		worldWidth: number,
		worldHeight: number,
	): string => {
		if (viewWidth === worldWidth && viewHeight === worldHeight) return '';
		return `scale3d(${viewWidth / worldWidth}, ${viewHeight / worldHeight}, 1)`;
	};
</script>

<!-- TODO maybe instead use ResizeObserver? the iframe measuring feels unfortunate -->
<div class="view" style:transform>
	<World width={worldWidth} height={worldHeight} stages={[Stage]} bind:activeStageState />
</div>
{#if currentStage}
	<InteractiveSurface
		width={screenWidth}
		height={screenHeight}
		controller={currentStage.controller}
	/>
{/if}

<style>
	.view {
		position: absolute !important;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
