<script lang="ts">
	import type {Async_Status} from '@grogarden/util/async.js';
	import {Texture, SCALE_MODES} from '@pixi/core';
	import {Sprite} from '@pixi/sprite';
	import {Container} from '@pixi/display';

	import {get_pixi_scene} from '$lib/pixi';
	import WaitingScreen from '$lib/WaitingScreen.svelte';
	import {Assets} from '@pixi/assets';

	// TODO refactor with the route component

	// TODO This code is hacky and complex because the Pixi loader API is a headache :/
	// Biggest problem is it throws an error if you add a resource while it's loading.
	// (looking at this much later, can we just detect if a resource has already been loaded?)
	// Maybe we could look in `BaseTextureCache`
	// and be aggressive about calling `loader.reset`?
	// But then we'll throw away loading assets if they're not done. (does the browser cache tho?)
	// Probably want to encapsulate this possibly-concurrent loader logic, maybe in `get_pixi_scene`?

	export let cameraX: number;
	export let cameraY: number;
	export let cameraScale: number;
	export let imageUrl: string;

	let sprite: Sprite | null = null;
	let destroyed = false;

	const {scene} = get_pixi_scene({
		loaded: async () => {
			// this *might* handle a corner case bug due to the fact that we're not reactively listening to the loader
			if (!destroyed) await updateSprite(imageUrl);
		},
		destroy: () => {
			destroySprite();
			destroyed = true;
		},
	});
	const camera = new Container();
	scene.addChild(camera);

	$: void updateSprite(imageUrl);
	const updateSprite = async (url: string) => {
		const texture = await Assets.load(url);
		if (sprite && sprite.texture === texture) {
			return;
		}
		createSprite(texture);
	};

	const createSprite = (texture: Texture) => {
		if (sprite) destroySprite();
		// I think I'd prefer nearest neighbor, but that causes weird artifacts with slow animation
		texture.baseTexture.setStyle(SCALE_MODES.LINEAR); // TODO where to do this? ideally on load
		sprite = new Sprite(texture);
		camera.addChild(sprite);
	};

	const destroySprite = () => {
		if (!sprite) return;
		camera.removeChild(sprite);
		sprite.destroy();
		sprite = null;
	};

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera(camera, cameraX, cameraY, cameraScale);
	const updateCamera = (camera: Container, x: number, y: number, scale: number) => {
		camera.scale.set(scale);
		camera.position.set(x, y);
	};

	// TODO handle failure and initial?
	let loadingStatus: Async_Status;
	$: loadingStatus = sprite ? 'success' : 'pending';
</script>

{#if loadingStatus !== 'success'}
	<WaitingScreen status={loadingStatus} />
{/if}
