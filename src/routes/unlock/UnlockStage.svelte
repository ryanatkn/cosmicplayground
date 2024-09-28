<script lang="ts">
	import type {Writable} from 'svelte/store';

	import World from '$lib/World.svelte';
	import SurfaceWithControlller from '$lib/SurfaceWithControlller.svelte';
	import {DomCanvasRenderer} from '$lib/DomCanvasRenderer.js';
	import type {Controller} from '$lib/controller.js';
	import type {CameraStore} from '$lib/camera.js';
	import {clock_context} from '$lib/clock.js';
	import {get_pixi} from '$lib/pixi';
	import type {UnlockStageScores, Stage} from '$routes/unlock/unlockStage';
	import {get_idle} from '$lib/idle.js';

	export let viewportWidth: number;
	export let viewportHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let worldWidth: number;
	export let worldHeight: number;
	export let cameraUnlocked = false;
	export let finish: (scores: UnlockStageScores) => Promise<void>;
	export let stage: Stage;
	export let enableDomCanvasRenderer = false;

	$: console.log(`UnlockStage.svelte stage`, stage);

	const clock = clock_context.get();
	const pixi = get_pixi();

	$: domCanvasRenderer = enableDomCanvasRenderer ? new DomCanvasRenderer() : null;

	const idle = get_idle();
	$: if ($idle) clock.pause();

	let camera: CameraStore;
	let scores: Writable<UnlockStageScores>;
	let controller: Controller;
	$: ({camera, scores, controller} = stage);

	// TODO maybe replace all `clock` usage with the app ticker
	$: $clock, stage, syncStageState();

	let finished = false;
	const STAGE_DURATION = 30000; // TODO add to controls (multiple "finish" conditions)

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
