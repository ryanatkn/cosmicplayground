<script lang="ts">
	import {getPixi} from '$lib/app/pixi'; // TODO BLOCK dont import from app...
	import type {Stage} from '$lib/portals/home/starshipStage'; // TODO shouldnt import this
	import type {CameraState} from '$lib/flat/camera';
	import {onDestroy} from 'svelte';

	// TODO refactor with the route component

	// TODO This code is hacky and complex because the Pixi loader API is a headache :/
	// Biggest problem is it throws an error if you add a resource while it's loading.
	// (looking at this much later, can we just detect if a resource has already been loaded?)
	// Maybe we could look in `Pixi.BaseTextureCache`
	// and be aggressive about calling `loader.reset`?
	// But then we'll throw away loading assets if they're not done. (does the browser cache tho?)
	// Probably want to encapsulate this possibly-concurrent loader logic, maybe in `getPixiScene`?

	export let worldWidth: number;
	export let worldHeight: number;
	export let viewWidth: number;
	export let viewHeight: number;
	export let stage: Stage; // is not reactive

	$: ({camera} = stage);

	const pixi = getPixi();
	const scene = pixi.currentScene;
	const {container} = stage;
	scene.addChild(container);

	/*

  TODO We're implementing Pixi directly in the starship stage,
  which undesirably couples rendering to the stage and simulation.
  We'll look at refactoring things once everything is working well.
  One idea was to essentially diff the entities in the simulation
  with the Pixi objects here in this component,
  but that seems too wasteful to go with for now.

  */

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
