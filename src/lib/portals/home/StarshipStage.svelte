<script lang="ts">
	import World from '$lib/flat/World.svelte';
	import {
		PLAYER_SPEED,
		PLAYER_SPEED_BOOSTED,
		PLAYER_STRENGTH,
		PLAYER_STRENGTH_BOOSTED,
		PLAYER_STRENGTH_BOOSTED1,
		PLAYER_STRENGTH_BOOSTED2,
		PLAYER_STRENGTH_BOOSTED3,
		Stage,
		type StarshipStageScores,
	} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clock';
	import {getIdle} from '$lib/app/trackIdleState';
	import InteractiveSurface from '$lib/flat/InteractiveSurface.svelte';
	import {getPixi} from '$lib/app/pixi';
	import {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {CameraStore} from '$lib/flat/camera';
	import type {Writable} from 'svelte/store';
	import type {Controller} from '$lib/flat/Controller';

	export let viewportWidth: number;
	export let viewportHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let worldWidth: number;
	export let worldHeight: number;
	export let cameraUnlocked = false;
	export let speedBoosterEnabled = false;
	export let strengthBoosterEnabled = false;
	export let strengthBooster1Enabled = false;
	export let strengthBooster2Enabled = false;
	export let strengthBooster3Enabled = false;
	export let starshipX = 0;
	export let starshipY = 0;
	export let starshipAngle = 0;
	export let starshipShieldRadius = 0;
	export let finish: (scores: StarshipStageScores | null) => Promise<void>;
	export let stage: Stage;
	export let enableDomCanvasRenderer = false;

	const clock = getClock();
	const pixi = getPixi();

	$: domCanvasRenderer = enableDomCanvasRenderer ? new DomCanvasRenderer() : null;

	const idle = getIdle();
	$: if ($idle) clock.pause();

	let camera: CameraStore;
	let scores: Writable<StarshipStageScores>;
	let controller: Controller;
	$: ({camera, scores, controller} = stage);

	// TODO maybe replace all `clock` usage with the app ticker
	$: $clock, syncStageState();

	let finished = false;
	const STAGE_DURATION = 30000;

	$: stage.player.speed = speedBoosterEnabled ? PLAYER_SPEED_BOOSTED : PLAYER_SPEED;
	$: stage.player.strength =
		(strengthBoosterEnabled ? PLAYER_STRENGTH_BOOSTED : PLAYER_STRENGTH) +
		(strengthBooster1Enabled ? PLAYER_STRENGTH_BOOSTED1 : 0) +
		(strengthBooster2Enabled ? PLAYER_STRENGTH_BOOSTED2 : 0) +
		(strengthBooster3Enabled ? PLAYER_STRENGTH_BOOSTED3 : 0);

	$: stage.freezeCamera = !cameraUnlocked;
	// TODO refactor, maybe `camera.frozen`?
	$: if (cameraUnlocked) void camera.setPosition(starshipX, starshipY);

	// TODO refactor
	$: if (controller) controller.viewportWidth = viewportWidth;
	$: if (controller) controller.viewportHeight = viewportHeight;
	$: if (controller) controller.viewWidth = viewWidth;
	$: if (controller) controller.viewHeight = viewHeight;
	$: if (controller) controller.worldWidth = worldWidth;
	$: if (controller) controller.worldHeight = worldHeight;

	// TODO this is clumsy, keep refactoring to shrink it
	const syncStageState = () => {
		if (!finished && stage.time > STAGE_DURATION) {
			finished = true;
			void finish($scores);
		}

		starshipX = stage.player.x;
		starshipY = stage.player.y;

		// TODO animate instead of setting instantly (and have rotation acceleration/velocity properties on entities)
		starshipAngle = updateAngle(starshipAngle, stage.player.directionX, stage.player.directionY);

		starshipShieldRadius = stage.player.radius;
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
		const scale = Math.min(viewWidth / worldWidth, viewHeight / worldHeight);
		return `scale3d(${scale}, ${scale}, 1)`;
	};

	// TODO actions -- refactor this with the controls in `__layout.svelte` and `index.svelte` and `World.svelte`
	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && !e.ctrlKey) {
			e.preventDefault();
			e.stopImmediatePropagation();
			void finish(null);
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<div class="view" style:transform>
	<World
		{worldWidth}
		{worldHeight}
		{viewWidth}
		{viewHeight}
		{viewportWidth}
		{viewportHeight}
		{stage}
		{pixi}
		{controller}
		{domCanvasRenderer}
		{clock}
	/>
</div>
<InteractiveSurface {controller} />

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
