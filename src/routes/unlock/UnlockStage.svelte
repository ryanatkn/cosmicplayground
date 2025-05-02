<script lang="ts">
	import { run } from 'svelte/legacy';

	import type {Writable} from 'svelte/store';

	import World from '$lib/World.svelte';
	import SurfaceWithControlller from '$lib/SurfaceWithControlller.svelte';
	import {DomCanvasRenderer} from '$lib/DomCanvasRenderer.js';
	import type {Controller} from '$lib/controller.js';
	import type {CameraStore} from '$lib/camera.js';
	import {clock_context} from '$lib/clock.js';
	import {pixi_context} from '$lib/pixi.js';
	import type {UnlockStageScores, Stage} from '$routes/unlock/unlockStage.js';
	import {idle_context} from '$lib/idle.js';

	interface Props {
		viewportWidth: number;
		viewportHeight: number;
		viewWidth: number;
		viewHeight: number;
		worldWidth: number;
		worldHeight: number;
		cameraUnlocked?: boolean;
		finish: (scores: UnlockStageScores) => Promise<void>;
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
		finish,
		stage = $bindable(),
		enableDomCanvasRenderer = false
	}: Props = $props();


	const clock = clock_context.get();
	const pixi = pixi_context.get();


	const idle = idle_context.get();

	let camera: CameraStore = $state();
	let scores: Writable<UnlockStageScores> = $state();
	let controller: Controller = $state();


	let finished = false;
	const STAGE_DURATION = 30000; // TODO add to controls (multiple "finish" conditions)



	// TODO this is clumsy, keep refactoring to shrink it
	const syncStageState = () => {
		if (!finished && stage.time > STAGE_DURATION) {
			finished = true;
			void finish($scores);
		}
	};


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
	run(() => {
		console.log(`UnlockStage.svelte stage`, stage);
	});
	let domCanvasRenderer = $derived(enableDomCanvasRenderer ? new DomCanvasRenderer() : null);
	run(() => {
		if ($idle) clock.pause();
	});
	run(() => {
		({camera, scores, controller} = stage);
	});
	// TODO maybe replace all `clock` usage with the app ticker
	run(() => {
		$clock, stage, syncStageState();
	});
	run(() => {
		stage.freezeCamera = !cameraUnlocked;
	});
	// TODO should this be on the stage class?
	// TODO refactor, maybe `camera.frozen`?
	run(() => {
		if (cameraUnlocked) void camera.setPosition(stage.player.x, stage.player.y);
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
