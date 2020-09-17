<script>
	import {AsyncState} from '@feltcoop/gro/dist/utils/async';

	import {usePixiScene} from '../../app/pixi.js';
	import WaitingScreen from '../../app/WaitingScreen.svelte';

	// TODO This code is hacky and complex because the Pixi loader API is a headache :/
	// Biggest problem is it throws an error if you add a resource while it's loading.
	// Maybe we could look in `PIXI.BaseTextureCache`
	// and be aggressive about calling `loader.reset`?
	// But then we'll throw away loading assets if they're not done. (does the browser cache tho?)
	// Probably want to encapsulate this possibly-concurrent loader logic, maybe in `usePixiScene`?

	export let cameraX;
	export let cameraY;
	export let cameraScale;
	export let imageUrl;

	const camera = new PIXI.Container();
	let sprite = null;
	let destroyed = false;

	const [pixi, scene] = usePixiScene({
		loaded: () => {
			updateSprite(imageUrl); // this *might* handle a corner case bug due to the fact that we're not reactively listening to the loader
		},
		destroy: () => {
			destroyed = true;
		},
	});
	scene.addChild(camera);

	const updateSprite = async (url) => {
		if (destroyed || url !== imageUrl) return;
		const resource = pixi.loader.resources[url];
		if (!resource) {
			if (sprite) destroySprite();
			if (pixi.loader.loading) {
				await pixi.waitForLoad();
				updateSprite(url);
			} else {
				pixi.loader.add(url);
				pixi.loader.load();
				await pixi.waitForLoad();
				updateSprite(url);
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

	const createSprite = (texture) => {
		if (sprite) destroySprite();
		// I think I'd prefer nearest neighbor, but that causes weird artifacts with slow animation
		texture.baseTexture.setStyle(PIXI.SCALE_MODES.LINEAR); // TODO where to do this? ideally on load
		sprite = new PIXI.Sprite(texture);
		camera.addChild(sprite);
	};

	const destroySprite = () => {
		camera.removeChild(sprite);
		sprite.destroy();
		sprite = null;
	};

	// TODO copied from `EarthPixiViewer`, extract camera store (see also `View.svelte` parent component)
	$: updateCamera(camera, cameraX, cameraY, cameraScale);
	const updateCamera = (camera, x, y, scale) => {
		camera.scale.set(scale);
		camera.position.set(x, y);
	};

	$: updateSprite(imageUrl);

	// TODO handle failure and initial?
	$: loadingStatus = sprite ? AsyncState.Success : AsyncState.Pending;
</script>

{#if loadingStatus !== AsyncState.Success}
	<WaitingScreen status={loadingStatus} />
{/if}
