<script lang="ts">
	import * as Pixi from 'pixi.js';

	import {getPixi} from '$lib/app/pixi'; // TODO BLOCK dont import from app...
	import type {Stage} from '$lib/portals/home/starshipStage'; // TODO shouldnt import this
	import type {CameraState} from '$lib/flat/camera';
	import {onDestroy, onMount} from 'svelte';

	// TODO refactor with the route component

	// TODO This code is hacky and complex because the Pixi loader API is a headache :/
	// Biggest problem is it throws an error if you add a resource while it's loading.
	// (looking at this much later, can we just detect if a resource has already been loaded?)
	// Maybe we could look in `Pixi.BaseTextureCache`
	// and be aggressive about calling `loader.reset`?
	// But then we'll throw away loading assets if they're not done. (does the browser cache tho?)
	// Probably want to encapsulate this possibly-concurrent loader logic, maybe in `getPixiScene`?

	export let width: number;
	export let height: number;
	export let stage: Stage;

	console.log(`PixiCanvas width, height, stage`, width, height, stage);

	$: ({camera, sim} = stage);

	const pixi = getPixi();
	const scene = pixi.currentScene;

	const container = new Pixi.Container();

	onMount(() => {
		scene.addChild(container);

		// TODO how to create bodies that get added?
		console.log(`stage`, stage.sim.bodies);
		for (const entity of sim.bodies) {
			if (entity.invisible) continue;
			const graphics = new Pixi.Graphics();
			if (entity._circle) {
				graphics.beginFill(0xdefa89);
				// TODO camera
				graphics.drawCircle(entity.x, entity.y, entity.radius);
			} else {
				// TODO other graphics?
				continue;
			}
			graphics.endFill();
			container.addChild(graphics);
		}
	});

	onDestroy(() => {
		scene.removeChild(container);
		container.destroy({children: true, baseTexture: true, texture: true});
	});

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera($camera);
	const updateCamera = ($camera: CameraState) => {
		// container.width = $camera.width;
		// container.height = $camera.height;
		container.position.set($camera.x, $camera.y);
	};
</script>
