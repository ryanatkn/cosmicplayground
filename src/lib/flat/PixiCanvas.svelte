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
			// TODO how to store these?
			// - make a map and lookup each loop, apply styles
			// - set `Entity.pixiContainer` (update either in a loop or even inline in the sim, or change the entity API to do this)
			const entityContainer = new Pixi.Container();
			container.addChild(entityContainer);
			entityContainer.position.set(entity.x, entity.y);

			if (entity._circle) {
				const graphics = new Pixi.Graphics();
				entityContainer.addChild(graphics);
				graphics.lineStyle(1, entity.colorHex);
				graphics.beginFill(0, 0);
				graphics.drawCircle(0, 0, entity.radius);
				graphics.endFill();
			}
			// TODO other graphics?

			if (entity.text) {
				const text = new Pixi.Text(entity.text, {fontSize: entity.fontSize});
				entityContainer.addChild(text);
				text.anchor.set(0.5, 0.5);
			}
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
