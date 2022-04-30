<script lang="ts">
	import {onDestroy} from 'svelte';
	import type * as Pixi from 'pixi.js';

	import type {Stage} from '$lib/flat/Stage'; // TODO shouldnt import this
	import type {CameraState} from '$lib/flat/camera';

	export let worldWidth: number;
	export let worldHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let viewportWidth: number;
	export let viewportHeight: number;
	export let scene: Pixi.Container; // is not reactive
	export let stage: Stage; // is not reactive

	const {container, camera} = stage;
	stage.initScene(scene); // TODO this overlaps weirdly with create/destroy
	onDestroy(() => {
		stage.destroyScene(scene); // TODO this overlaps weirdly with create/destroy
	});

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera(
		$camera,
		worldWidth,
		worldHeight,
		viewWidth,
		viewHeight,
		viewportWidth,
		viewportHeight,
	);
	const updateCamera = (
		$camera: CameraState,
		worldWidth: number,
		worldHeight: number,
		viewWidth: number,
		viewHeight: number,
		viewportWidth: number,
		viewportHeight: number,
	) => {
		// TODO get scale from camera
		const scale = Math.min(viewWidth / worldWidth, viewHeight / worldHeight);
		console.log(`scale`, scale);
		container.scale.set(scale);
		container.position.set(
			(-$camera.x + $camera.width / 2) * scale + (viewportWidth - viewWidth) / 2,
			(-$camera.y + $camera.height / 2) * scale + (viewportHeight - viewHeight) / 2,
		);
		// TODO see `await tick()` rerender comment in `StarshipStage` --
		// we may want to queue a rerender here if the app ticker is stopped (or $clock?)
	};
</script>
