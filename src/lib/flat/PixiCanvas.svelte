<script lang="ts">
	import {onDestroy, onMount} from 'svelte';

	import type {Stage} from '$lib/flat/Stage'; // TODO shouldnt import this
	import type {CameraState} from '$lib/flat/camera';
	import type {ClockStore} from '$lib/app/clockStore';
	import type {PixiApp} from '$lib/app/pixi';

	export let worldWidth: number;
	export let worldHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let viewportWidth: number;
	export let viewportHeight: number;
	export let pixi: PixiApp; // is not reactive
	export let stage: Stage; // is not reactive
	export let clock: ClockStore;

	const {container, camera} = stage;
	pixi.currentScene.addChild(container);
	onDestroy(() => {
		pixi.currentScene.removeChild(container);
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
		container.scale.set(scale);
		container.position.set(
			(-$camera.x + $camera.width / 2) * scale + (viewportWidth - viewWidth) / 2,
			(-$camera.y + $camera.height / 2) * scale + (viewportHeight - viewHeight) / 2,
		);
	};

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
		return () => {
			// TODO BLOCK use clock instead?
			pixi.app.render();
			pixi.app.start();
		};
	});

	// This must follow `updateCamera`.
	$: worldWidth,
		worldHeight,
		viewWidth,
		viewHeight,
		viewportWidth,
		viewportHeight,
		pixi.app.render();
</script>
