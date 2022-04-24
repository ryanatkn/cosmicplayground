<script lang="ts">
	import {onDestroy} from 'svelte';
	import type * as Pixi from 'pixi.js';

	import type {Stage} from '$lib/flat/Stage'; // TODO shouldnt import this
	import type {CameraState} from '$lib/flat/camera';

	export let worldWidth: number;
	export let worldHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let scene: Pixi.Container; // is not reactive
	export let stage: Stage; // is not reactive

	const {container, camera} = stage;
	scene.addChild(container);

	onDestroy(() => {
		scene.removeChild(container);
	});

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera($camera);
	const updateCamera = ($camera: CameraState) => {
		const scale = Math.min(viewWidth / worldWidth, viewHeight / worldHeight); // TODO block get from camera? then remove `viewWidth/height`?
		container.scale.set(scale);
		container.position.set($camera.x, $camera.y);
	};
</script>
