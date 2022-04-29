<script lang="ts">
	import {onDestroy} from 'svelte';
	import type * as Pixi from 'pixi.js';

	import type {Stage} from '$lib/flat/Stage'; // TODO shouldnt import this
	import type {CameraState} from '$lib/flat/camera';

	export let worldWidth: number;
	export let worldHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let screenWidth: number;
	export let screenHeight: number;
	export let scene: Pixi.Container; // is not reactive
	export let stage: Stage; // is not reactive

	const {container, camera} = stage;
	scene.addChild(container);

	onDestroy(() => {
		scene.removeChild(container);
	});

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera(
		$camera,
		worldWidth,
		worldHeight,
		viewWidth,
		viewHeight,
		screenWidth,
		screenHeight,
	);
	const updateCamera = (
		$camera: CameraState,
		worldWidth: number,
		worldHeight: number,
		viewWidth: number,
		viewHeight: number,
		screenWidth: number,
		screenHeight: number,
	) => {
		// TODO get scale from camera
		const scale = Math.min(viewWidth / worldWidth, viewHeight / worldHeight);
		container.scale.set(scale);
		container.position.set(
			(-$camera.x + $camera.width / 2) * scale + (screenWidth - viewWidth) / 2,
			(-$camera.y + $camera.height / 2) * scale + (screenHeight - viewHeight) / 2,
		);
	};
</script>
