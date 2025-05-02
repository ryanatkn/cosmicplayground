<script lang="ts">
	import {run} from 'svelte/legacy';

	import {swallow} from '@ryanatkn/belt/dom.js';
	import type {Writable} from 'svelte/store';

	import {clock_context} from '$lib/clock.js';
	import World from '$lib/World.svelte';
	import SurfaceWithControlller from '$lib/SurfaceWithControlller.svelte';
	import {DomCanvasRenderer} from '$lib/DomCanvasRenderer.js';
	import type {CameraStore} from '$lib/camera.js';
	import type {Controller} from '$lib/controller.js';
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
	} from '$routes/starshipStage.js';
	import {pixi_context} from '$lib/pixi.js';

	interface Props {
		viewportWidth: number;
		viewportHeight: number;
		viewWidth: number;
		viewHeight: number;
		worldWidth: number;
		worldHeight: number;
		cameraUnlocked?: boolean;
		speed_booster_enabled?: boolean;
		strengthBoosterEnabled?: boolean;
		strengthBooster1Enabled?: boolean;
		strengthBooster2Enabled?: boolean;
		strengthBooster3Enabled?: boolean;
		starshipX?: number;
		starshipY?: number;
		starshipAngle?: number;
		starshipShieldRadius?: number;
		finish: (scores: StarshipStageScores | null) => Promise<void>;
		stage: Stage;
		enableDomCanvasRenderer?: boolean;
	}

	let {
		viewportWidth,
		viewportHeight,
		viewWidth,
		viewHeight,
		worldWidth,
		worldHeight,
		cameraUnlocked = false,
		speed_booster_enabled = false,
		strengthBoosterEnabled = false,
		strengthBooster1Enabled = false,
		strengthBooster2Enabled = false,
		strengthBooster3Enabled = false,
		starshipX = $bindable(0),
		starshipY = $bindable(0),
		starshipAngle = $bindable(0),
		starshipShieldRadius = $bindable(0),
		finish,
		stage = $bindable(),
		enableDomCanvasRenderer = false,
	}: Props = $props();

	const clock = clock_context.get();
	const pixi = pixi_context.get();

	let camera: CameraStore = $state();
	let scores: Writable<StarshipStageScores> = $state();
	let controller: Controller = $state();

	let finished = false;

	// TODO this is clumsy, keep refactoring to shrink it
	// should be connected to `starshipStage.update`?
	const syncStageState = () => {
		if (!finished && stage.finished) {
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
		if (e.key === 'q' && !e.ctrlKey) {
			// TODO q or e for exit?
			swallow(e);
			void finish(null);
		}
	};
	let domCanvasRenderer = $derived(enableDomCanvasRenderer ? new DomCanvasRenderer() : null);
	run(() => {
		({camera, scores, controller} = stage);
	});
	// TODO maybe replace all `clock` usage with the app ticker
	run(() => {
		$clock, syncStageState();
	});
	run(() => {
		stage.player.speed = speed_booster_enabled ? PLAYER_SPEED_BOOSTED : PLAYER_SPEED;
	});
	run(() => {
		stage.player.strength =
			(strengthBoosterEnabled ? PLAYER_STRENGTH_BOOSTED : PLAYER_STRENGTH) +
			(strengthBooster1Enabled ? PLAYER_STRENGTH_BOOSTED1 : 0) +
			(strengthBooster2Enabled ? PLAYER_STRENGTH_BOOSTED2 : 0) +
			(strengthBooster3Enabled ? PLAYER_STRENGTH_BOOSTED3 : 0);
	});
	run(() => {
		stage.freezeCamera = !cameraUnlocked;
	});
	// TODO refactor, maybe `camera.frozen`?
	run(() => {
		if (cameraUnlocked) void camera.setPosition(starshipX, starshipY);
	});
	// TODO refactor
	run(() => {
		if (controller) controller.viewportWidth = viewportWidth;
	});
	run(() => {
		if (controller) controller.viewportHeight = viewportHeight;
	});
	run(() => {
		if (controller) controller.viewWidth = viewWidth;
	});
	run(() => {
		if (controller) controller.viewHeight = viewHeight;
	});
	run(() => {
		if (controller) controller.worldWidth = worldWidth;
	});
	run(() => {
		if (controller) controller.worldHeight = worldHeight;
	});
	let transform = $derived(computeWorldTransform(viewWidth, viewHeight, worldWidth, worldHeight));
</script>

<svelte:window onkeydown={onKeydown} />

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
		{domCanvasRenderer}
	/>
</div>
<SurfaceWithControlller {controller} />

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
