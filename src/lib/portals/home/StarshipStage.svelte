<script lang="ts">
	import {onMount, tick} from 'svelte';

	import World from '$lib/flat/World.svelte';
	import {
		PLAYER_SPEED,
		PLAYER_SPEED_BOOSTED,
		PLAYER_STRENGTH,
		PLAYER_STRENGTH_BOOSTED,
		Stage,
	} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clockStore';
	import {getIdle} from '$lib/app/trackIdleState';
	import InteractiveSurface from '$lib/flat/InteractiveSurface.svelte';
	import {getPixi} from '$lib/app/pixi';
	import {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {CameraStore} from '$lib/flat/camera';

	export let viewportWidth: number;
	export let viewportHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let worldWidth: number;
	export let worldHeight: number;
	export let cameraUnlocked = false;
	export let speedBoosterEnabled = false;
	export let strengthBoosterEnabled = false;
	export let starshipX = 0;
	export let starshipY = 0;
	export let starshipAngle = 0;
	export let starshipShieldRadius = 0;
	export let finish: () => void;
	export let exit: () => void;
	export let stage: Stage;
	export let enableDomCanvasRenderer = false;

	$: ({controller} = stage);

	const clock = getClock();
	const pixi = getPixi();

	$: domCanvasRenderer = enableDomCanvasRenderer ? new DomCanvasRenderer() : null;

	const idle = getIdle();
	$: if ($idle) clock.pause();

	let camera: CameraStore;
	$: ({camera} = stage);

	// This stops the app's rendering when paused for efficiency.
	// It will need some tweaking if/when we add camera zoom.
	// It'd also be nice to have a general solution, not hardcoded to this one component.
	$: if ($clock.running) {
		pixi.app.start();
	} else {
		pixi.app.stop();
		void camera.setPosition($camera.x, $camera.y, {hard: true});
	}
	onMount(() => {
		// render because the stage is paused initially
		// TODO this was needed before the `await tick()` below, but that'll be refactored too,
		// and also see below that this logic doesn't belong in this component
		// pixi.app.render();
		return () => {
			pixi.app.render();
			pixi.app.start();
		};
	});
	// TODO BLOCK move this logic to the PixiCanvas
	// rerender on resize - TODO probably refactor with World resizing,
	// shouldn't be a concern of this component
	$: worldWidth,
		worldHeight,
		viewWidth,
		viewHeight,
		viewportWidth,
		viewportHeight,
		void queueRerender();
	const queueRerender = async () => {
		await tick(); // TODO this is a hack to let the camera update first
		pixi.app.render();
	};

	// TODO maybe replace all `clock` usage with the app ticker
	$: $clock, syncStageState();

	let finished = false;
	const STAGE_DURATION = 30000;

	$: stage.player.speed = speedBoosterEnabled ? PLAYER_SPEED_BOOSTED : PLAYER_SPEED;
	$: stage.player.strength = strengthBoosterEnabled ? PLAYER_STRENGTH_BOOSTED : PLAYER_STRENGTH;
	$: stage.freezeCamera = !cameraUnlocked;
	$: if (cameraUnlocked) void camera.setPosition(starshipX, starshipY);

	// TODO refactor
	$: if (controller) controller.viewportWidth = viewportWidth;
	$: if (controller) controller.viewportHeight = viewportHeight;
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
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopImmediatePropagation();
			exit();
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
		scene={pixi.currentScene}
		{controller}
		{domCanvasRenderer}
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
