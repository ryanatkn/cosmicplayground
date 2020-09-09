<script>
	import {onMount, onDestroy} from 'svelte';
	import * as PIXI from 'pixi.js';

	import {computeBlendedImagesContinuumOpacities} from '../../app/blendedImagesContinuum.js';
	import {
		computeBlendedImagesCycleOpacities,
		computeBlendedImagesCycleZIndex,
	} from '../../app/blendedImagesCycle.js';
	import {usePixi} from '../../app/pixi.js';
	import InteractiveSurface from '../../app/InteractiveSurface.svelte';

	// TODO should we cache stuff at the module scope? mainly thinking of the render textures
	// or should we free all resources when this is unmounted? including all base textures?

	export let width;
	export let height;
	export let x;
	export let y;
	export let scale;
	export let moveCamera;
	export let zoomCamera;
	export let inputEnabled;
	export let landImages; // not reactive
	export let seaImages; // not reactive
	export let activeLandValue;
	export let activeSeaLevel;
	export let imageWidth; // not reactive
	export let imageHeight; // not reactive

	const pixi = usePixi();

	let destroyed = false;

	const landSprites = []; // not reactive
	const seaSprites = []; // not reactive
	let scene;
	let mapContainer;
	let landContainer;
	let seaContainer;

	$: tilePositionX = -$x * $scale + width / 2;
	$: tilePositionY = -$y * $scale + height / 2;

	$: updateSpriteDimensions(landSprites, width, height);
	$: updateSpriteDimensions(seaSprites, width, height);
	const updateSpriteDimensions = (sprites, width, height) => {
		for (const sprite of sprites) {
			sprite.width = width;
			sprite.height = height;
		}
	};
	$: updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);
	$: updateSpriteTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
	const updateSpriteTransforms = (sprites, tilePositionX, tilePositionY, $scale) => {
		for (const sprite of sprites) {
			sprite.tileScale.set($scale);
			sprite.tilePosition.set(tilePositionX, tilePositionY);
		}
	};
	// Before changing to a tiling sprite, this was the update logic. Keeping for future reference.
	// $: if (mapContainer) {
	// 	mapContainer.scale.set($scale);
	// 	mapContainer.position.set(-$x * $scale + width / 2, -$y * $scale + height / 2);
	// }

	const seaOpacities = new Array(seaImages.length);
	$: if (seaSprites.length) updateSeaOpacities(activeSeaLevel);
	const updateSeaOpacities = (activeSeaLevel) => {
		computeBlendedImagesContinuumOpacities(
			seaImages.length,
			activeSeaLevel,
			seaOpacities, // mutate the existing opacities
		);
		for (let i = 0; i < seaOpacities.length; i++) {
			seaSprites[i].alpha = seaOpacities[i];
		}
	};
	const landOpacities = new Array(landImages.length);
	$: if (landSprites.length) updateLandOpacities(activeLandValue);
	const updateLandOpacities = (activeLandValue) => {
		computeBlendedImagesCycleOpacities(
			landImages.length,
			activeLandValue,
			landOpacities, // mutate the existing opacities
		);
		const count = landSprites.length;
		for (let i = 0; i < count; i++) {
			const sprite = landSprites[i];
			const alpha = landOpacities[i];
			// This diffing might not be helpful like it is with `zIndex` below but w/e.
			if (sprite.alpha !== alpha) {
				sprite.alpha = alpha;
			}
			// TODO changing zIndex can be optimized with another official Pixi library
			// https://github.com/pixijs/pixi-layers - https://www.npmjs.com/package/pixi-layers
			const zIndex = computeBlendedImagesCycleZIndex(count, i, landOpacities[i]);
			// Pixi sets the dirty flag even if the `zIndex` value doesn't change,
			// so we diff before assigning it.
			if (zIndex !== sprite.zIndex) {
				sprite.zIndex = zIndex;
			}
		}
	};

	const init = () => {
		const shouldLoadResources = !pixi.loader.resources[landImages[0]]; // TODO cleaner detection?
		if (shouldLoadResources) {
			for (const landImage of landImages) {
				pixi.loader.add(landImage);
			}
			for (const seaImage of seaImages) {
				pixi.loader.add(seaImage);
			}
		}
		// TODO show progress? or expect title screen to make these gtg?
		pixi.loader.load(onLoad);
	};
	const onLoad = (loader, resources) => {
		if (destroyed) return; // in case the component unmounts before loading finishes

		console.log('LOADED', loader, resources);
		scene = new PIXI.Container();
		pixi.mountScene(scene);

		mapContainer = new PIXI.Container();
		scene.addChild(mapContainer);

		landContainer = new PIXI.Container();
		mapContainer.addChild(landContainer);
		landContainer.sortableChildren = true;
		for (const landImage of landImages) {
			const sprite = createMapSprite(resources[landImage].texture);
			landContainer.addChild(sprite);
			landSprites.push(sprite);
		}
		updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);

		seaContainer = new PIXI.Container();
		mapContainer.addChild(seaContainer);
		for (const seaImage of seaImages) {
			const sprite = createMapSprite(resources[seaImage].texture);
			seaContainer.addChild(sprite);
			seaSprites.push(sprite);
		}
		updateSpriteTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
	};

	const createMapSprite = (texture) => {
		const tempSprite1 = new PIXI.Sprite(texture);
		const tempSprite2 = new PIXI.Sprite(texture);
		tempSprite2.angle = 180;
		tempSprite2.y = imageHeight * 2;
		tempSprite2.x = imageWidth;
		const tempTextureContainer = new PIXI.Container();
		tempTextureContainer.addChild(tempSprite1);
		tempTextureContainer.addChild(tempSprite2);
		// TODO cache this at module scope? see comment at top of file
		const renderTexture = PIXI.RenderTexture.create({width: imageWidth, height: imageHeight * 2});
		pixi.renderer.render(tempTextureContainer, renderTexture);
		return new PIXI.TilingSprite(renderTexture, width, height);
	};

	const destroy = () => {
		if (destroyed) throw Error('Already destroyed');
		if (scene) {
			pixi.unmountScene(scene);
			scene.destroy({
				children: true,
				// TODO should we destroy the textures too?
				// I'm not sure of the best balance for UX and resource usage concerns.
				// Do we want it to be snappy if users navigate back to the page?
				// What if some textures are used in other areas of the app?
				// Do we want some custom heuristic, like nagivating away from this portal?
				texture: false,
				baseTexture: false,
			});
		}
		destroyed = true;
	};

	onMount(init);
	onDestroy(destroy);
</script>

<InteractiveSurface {width} {height} scale={$scale} {moveCamera} {zoomCamera} {inputEnabled} />
