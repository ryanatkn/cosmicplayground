<script lang="ts">
	import type {AsyncStatus} from '@feltcoop/felt';
	import type PIXI from 'pixi.js';

	import {getPixiScene} from '$lib/app/pixi';
	import WaitingScreen from '$lib/app/WaitingScreen.svelte';

	// TODO refactor with the route component

	// TODO This code is hacky and complex because the Pixi loader API is a headache :/
	// Biggest problem is it throws an error if you add a resource while it's loading.
	// Maybe we could look in `PIXI.BaseTextureCache`
	// and be aggressive about calling `loader.reset`?
	// But then we'll throw away loading assets if they're not done. (does the browser cache tho?)
	// Probably want to encapsulate this possibly-concurrent loader logic, maybe in `getPixiScene`?

	export let cameraX: number;
	export let cameraY: number;
	export let cameraScale: number;
	export let imageUrl: string;

	let sprite: PIXI.Sprite | null = null;
	let destroyed = false;

	const [pixi, scene] = getPixiScene({
		loaded: async () => {
			// this *might* handle a corner case bug due to the fact that we're not reactively listening to the loader
			if (!destroyed) await updateSprite(imageUrl);
		},
		destroy: () => {
			if (sprite) destroySprite();
			destroyed = true;
		},
	});
	const camera = new pixi.PIXI.Container();
	scene.addChild(camera);

	$: void updateSprite(imageUrl);
	const updateSprite = async (url: string) => {
		if (url !== imageUrl) return;
		const resource = pixi.app.loader.resources[url];
		if (!resource) {
			if (sprite) destroySprite();
			if (pixi.app.loader.loading) {
				await pixi.waitForLoad();
				await updateSprite(url);
			} else {
				if (!pixi.app.loader.resources[url]) pixi.app.loader.add(url);
				pixi.app.loader.load();
				await pixi.waitForLoad();
				await updateSprite(url);
			}
		} else if (!resource.texture) {
			// no-op, resource exists but it's not loaded, let the load callback do the work
			if (sprite) destroySprite();
		} else if (sprite && sprite.texture === resource.texture) {
			// no-op, sprite is already loaded and what we expect
		} else {
			// texture's ready
			createSprite(resource.texture);
		}
	};

	const createSprite = (texture: PIXI.Texture) => {
		if (sprite) destroySprite();
		// I think I'd prefer nearest neighbor, but that causes weird artifacts with slow animation
		texture.baseTexture.setStyle(pixi.PIXI.SCALE_MODES.LINEAR); // TODO where to do this? ideally on load
		sprite = new pixi.PIXI.Sprite(texture);
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
	const updateCamera = (camera: PIXI.Container, x: number, y: number, scale: number) => {
		camera.scale.set(scale);
		camera.position.set(x, y);
	};

	// TODO handle failure and initial?
	let loadingStatus: AsyncStatus;
	$: loadingStatus = sprite ? 'success' : 'pending';
</script>

{#if loadingStatus !== 'success'}
	<WaitingScreen status={loadingStatus} />
{/if}
