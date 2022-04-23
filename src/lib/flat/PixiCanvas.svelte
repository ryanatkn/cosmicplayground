<script lang="ts">
	import * as Pixi from 'pixi.js';

	import {getPixiScene} from '$lib/app/pixi'; // TODO BLOCK dont import from app...
	import type {Stage} from '$lib/flat/stage';
	import type {CameraState} from '$lib/flat/camera';

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

	$: ({camera} = stage); // TODO type? should it know nothing of the stage? or should all stages have cameras?

	const [pixi, scene] = getPixiScene({
		loaded: async () => {
			console.log('PixiCanvas LOADED');
		},
	});

	const container = new Pixi.Container();
	scene.addChild(container);

	const graphics = new Pixi.Graphics();
	graphics.beginFill(0xdefa89);
	graphics.drawRect(50, 50, 150, 250);
	graphics.endFill();
	container.addChild(graphics);

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera($camera);
	const updateCamera = ($camera: CameraState) => {
		// camera.scale.set(scale);
		container.position.set($camera.x, $camera.y);
	};
</script>
