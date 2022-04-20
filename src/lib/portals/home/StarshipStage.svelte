<script lang="ts">
	import {dequal} from 'dequal/lite';

	import World from '$lib/flat/World.svelte';
	import {
		PLAYER_SPEED,
		PLAYER_SPEED_BOOSTED,
		Stage,
		toScores,
		type StarshipStageScores,
	} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clockStore';
	import {getIdle} from '$lib/app/trackIdleState';
	import InteractiveSurface from '$lib/flat/InteractiveSurface.svelte';

	export let screenWidth: number;
	export let screenHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let worldWidth: number;
	export let worldHeight: number;
	export let boosterEnabled = false;
	export let cameraUnlocked = false;
	export let starshipX = 0;
	export let starshipY = 0;
	export let starshipAngle = 0;
	export let starshipShieldRadius = 0;
	export let scores: StarshipStageScores | undefined;
	export let finish: () => void;
	export let exit: () => void;
	export let stage: Stage;

	$: ({controller} = stage);

	const clock = getClock();

	const idle = getIdle();
	$: if ($idle) clock.pause();

	$: $clock, syncStageState();

	let finished = false;
	const STAGE_DURATION = 30000;

	$: stage.player.speed = boosterEnabled ? PLAYER_SPEED_BOOSTED : PLAYER_SPEED;
	$: stage.freezeCamera = !cameraUnlocked;

	// TODO refactor
	$: if (controller) controller.screenWidth = screenWidth;
	$: if (controller) controller.screenHeight = screenHeight;
	$: if (controller) controller.viewWidth = viewWidth;
	$: if (controller) controller.viewHeight = viewHeight;
	$: if (controller) controller.worldWidth = worldWidth;
	$: if (controller) controller.worldHeight = worldHeight;

	// TODO this is clumsy
	const syncStageState = () => {
		if (!finished && stage.time > STAGE_DURATION) {
			finished = true;
			finish();
		}

		starshipX = stage.player.x;
		starshipY = stage.player.y;

		// TODO ?
		starshipAngle = updateAngle(starshipAngle, stage.player.directionX, stage.player.directionY);
		if (!stage.freezeCamera) {
			void stage.camera.setPosition(starshipX, starshipY);
		}
		starshipShieldRadius = stage.player.radius;

		// TODO refactor to be evented
		const nextScores = toScores(stage);
		if (!scores || !dequal(scores, nextScores)) {
			scores = nextScores;
		}

		// TODO refactor to be evented
		if (stage.controller.pressingExit) {
			exit();
		}
	};

	const updateAngle = (currentAngle: number, directionX: number, directionY: number): number =>
		!directionX && !directionY ? currentAngle : toTargetAngle(directionX, directionY);

	const toTargetAngle = (directionX: number, directionY: number): number =>
		Math.atan2(directionY, directionX);

	$: transform = computeWorldTransform(viewWidth, viewHeight, worldWidth, worldHeight);

	// TODO consider not scaling the canvas -- though it'll make collisions less precise...
	// also is this where the transform belongs, or should it be in `World` or even `index.svelte`?
	const computeWorldTransform = (
		viewWidth: number,
		viewHeight: number,
		worldWidth: number,
		worldHeight: number,
	): string => {
		if (viewWidth === worldWidth && viewHeight === worldHeight) return '';
		const scaleX = viewWidth / worldWidth;
		const scaleY = viewHeight / worldHeight;
		const scale = Math.min(scaleX, scaleY);
		return `scale3d(${scale}, ${scale}, 1)`;
	};
</script>

<div class="view" style:transform>
	<World width={worldWidth} height={worldHeight} {stage} {controller} />
</div>
<InteractiveSurface width={screenWidth} height={screenHeight} {controller} />

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
