<script lang="ts">
	import World from '$lib/flat/World.svelte';
	import {getClock} from '$lib/app/clock';
	import {getIdle} from '$lib/app/trackIdleState';
	import InteractiveSurface from '$lib/flat/InteractiveSurface.svelte';
	import {getPixi} from '$lib/app/pixi';
	import {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {CameraStore} from '$lib/flat/camera';
	import type {Writable} from 'svelte/store';
	import type {Controller} from '$lib/flat/Controller';
	import type {
		GravityUnlockStageScores,
		Stage,
	} from '$lib/portals/gravity-unlock/gravityUnlockStage';

	export let viewportWidth: number;
	export let viewportHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let worldWidth: number;
	export let worldHeight: number;
	export let cameraUnlocked = false;
	export let finish: (scores: GravityUnlockStageScores) => Promise<void>;
	export let stage: Stage;
	export let enableDomCanvasRenderer = false;

	$: console.log(`GravityUnlockStage.svelte stage`, stage);

	const clock = getClock();
	const pixi = getPixi();

	$: domCanvasRenderer = enableDomCanvasRenderer ? new DomCanvasRenderer() : null;

	const idle = getIdle();
	$: if ($idle) clock.pause();

	let camera: CameraStore;
	let scores: Writable<GravityUnlockStageScores>;
	let controller: Controller;
	$: ({camera, scores, controller} = stage);

	// TODO maybe replace all `clock` usage with the app ticker
	$: $clock, stage, syncStageState();

	let finished = false;
	const STAGE_DURATION = 30000;

	$: stage.freezeCamera = !cameraUnlocked;
	// TODO should this be on the stage class?
	// TODO refactor, maybe `camera.frozen`?
	$: if (cameraUnlocked) void camera.setPosition(stage.player.x, stage.player.y);

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
	};

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
</script>

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
