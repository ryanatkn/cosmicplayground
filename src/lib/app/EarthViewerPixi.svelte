<script lang="ts">
	import type {Readable} from 'svelte/store';
	import type PIXI from 'pixi.js';

	import {computeBlendedImagesContinuumOpacities} from '$lib/app/blendedImagesContinuum';
	import {
		computeBlendedImagesCycleOpacities,
		computeBlendedImagesCycleZIndex,
	} from '$lib/app/blendedImagesCycle';
	import {getPixiScene} from '$lib/app/pixi';
	import InteractiveSurface from '$lib/app/InteractiveSurface.svelte';

	// TODO should we cache stuff at the module scope? mainly thinking of the render textures
	// or should we free all resources when this is unmounted? including all base textures?

	export let width: number;
	export let height: number;
	export let x: Readable<number>;
	export let y: Readable<number>;
	export let scale: Readable<number>;
	export let moveCamera: (dx: number, dy: number) => void;
	export let zoomCamera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
	) => void;
	export let inputEnabled = true;
	export let landImages: string[]; // not reactive
	export let seaImages: string[]; // not reactive
	export let shoreImages: string[] | undefined = undefined; // not reactive
	export let seashoreFloorIndex: number | undefined = undefined;
	export let lightsImage: string | undefined = undefined; // not reactive
	export let lightsOpacity = 0;
	export let nightfallOpacity = 0;
	export let showLights = false;
	export let activeLandValue: number;
	export let activeSeaLevel: number;
	export let imageWidth: number; // not reactive
	export let imageHeight: number; // not reactive

	const [pixi] = getPixiScene({
		load: (loader) => {
			if (loader.resources[landImages[0]]) return; // TODO cleaner detection?
			for (const landImage of landImages) {
				loader.add(landImage);
			}
			for (const seaImage of seaImages) {
				loader.add(seaImage);
			}
			if (shoreImages) {
				for (const shoreImage of shoreImages) {
					loader.add(shoreImage);
				}
			}
			if (lightsImage) {
				loader.add(lightsImage);
			}
		},
		loaded: (scene, resources, _loader) => {
			mapContainer = new pixi.PIXI.Container();
			scene.addChild(mapContainer);

			landContainer = new pixi.PIXI.Container();
			mapContainer.addChild(landContainer);
			landContainer.sortableChildren = true;
			for (const landImage of landImages) {
				const sprite = createMapSprite(resources[landImage]!.texture!);
				landContainer.addChild(sprite);
				landSprites.push(sprite);
			}
			updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);

			seashoreContainer = new pixi.PIXI.Container();
			mapContainer.addChild(seashoreContainer);
			for (const seaImage of seaImages) {
				const sprite = createMapSprite(resources[seaImage]!.texture!);
				seashoreContainer.addChild(sprite);
				seashoreSprites.push(sprite);
			}
			if (shoreImages) {
				const shoreSprites = [];
				for (const shoreImage of shoreImages) {
					const sprite = createMapSprite(resources[shoreImage]!.texture!);
					seashoreContainer.addChild(sprite);
					shoreSprites.push(sprite);
				}
				for (const sprite of shoreSprites.reverse()) {
					seashoreSprites.unshift(sprite);
				}
			}
			updateSpriteTransforms(seashoreSprites, tilePositionX, tilePositionY, $scale);

			if (lightsImage) {
				overlayContainer = new pixi.PIXI.Container();
				mapContainer.addChild(overlayContainer);

				const nightfallSprite = new pixi.PIXI.TilingSprite(pixi.PIXI.Texture.WHITE, width, height);
				nightfallSprite.tint = 0x000000;
				nightfallSprite.alpha = 0;
				overlayContainer.addChild(nightfallSprite);
				overlaySprites.push(nightfallSprite);

				const lightsSprite = createMapSprite(resources[lightsImage]!.texture!);
				lightsSprite.alpha = 0;
				overlayContainer.addChild(lightsSprite);
				overlaySprites.push(lightsSprite);

				updateSpriteTransforms(overlaySprites, tilePositionX, tilePositionY, $scale);
			}
		},
		destroy: (_scene, _loader) => {
			console.log('destroyed earth');
			// k
		},
	});

	const landSprites: PIXI.TilingSprite[] = []; // not reactive
	const seashoreSprites: PIXI.TilingSprite[] = []; // not reactive
	const overlaySprites: PIXI.TilingSprite[] = []; // not reactive
	let mapContainer: PIXI.Container;
	let landContainer: PIXI.Container;
	let seashoreContainer: PIXI.Container; // includes shore sprites
	let overlayContainer: PIXI.Container;

	$: tilePositionX = -$x * $scale + width / 2;
	$: tilePositionY = -$y * $scale + height / 2;

	$: if (overlayContainer) {
		const visible = showLights;
		overlayContainer.visible = visible;
		if (visible) {
			// TODO hacky, maybe save each as a reference?
			// probably want to keep each as a separate opacity instead of setting once on the container
			overlayContainer.children[0].alpha = nightfallOpacity;
			overlayContainer.children[1].alpha = lightsOpacity;
		}
	}
	$: updateSpriteDimensions(landSprites, width, height);
	$: updateSpriteDimensions(seashoreSprites, width, height);
	$: updateSpriteDimensions(overlaySprites, width, height);
	const updateSpriteDimensions = (sprites: PIXI.TilingSprite[], width: number, height: number) => {
		for (const sprite of sprites) {
			sprite.width = width;
			sprite.height = height;
		}
	};
	$: updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);
	$: updateSpriteTransforms(seashoreSprites, tilePositionX, tilePositionY, $scale);
	$: updateSpriteTransforms(overlaySprites, tilePositionX, tilePositionY, $scale);
	const updateSpriteTransforms = (
		sprites: PIXI.TilingSprite[],
		tilePositionX: number,
		tilePositionY: number,
		$scale: number,
	) => {
		for (const sprite of sprites) {
			sprite.tileScale.set($scale);
			sprite.tilePosition.set(tilePositionX, tilePositionY);
		}
	};

	const seashoreImageCount = seaImages.length + (shoreImages ? shoreImages.length : 0);
	const seashoreOpacities = new Array(seashoreImageCount);
	$: if (seashoreSprites.length) updateSeaOpacities(activeSeaLevel);
	const updateSeaOpacities = (activeSeaLevel: number) => {
		computeBlendedImagesContinuumOpacities(
			seashoreImageCount,
			activeSeaLevel,
			seashoreOpacities, // mutate the existing opacities
			seashoreFloorIndex,
		);
		for (let i = 0; i < seashoreImageCount; i++) {
			seashoreSprites[i].alpha = seashoreOpacities[i];
		}
	};
	const landOpacities = new Array(landImages.length);
	$: if (landSprites.length) updateLandOpacities(activeLandValue);
	const updateLandOpacities = (activeLandValue: number) => {
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

	const createMapSprite = (texture: PIXI.Texture) => {
		const tempSprite1 = new pixi.PIXI.Sprite(texture);
		const tempSprite2 = new pixi.PIXI.Sprite(texture);
		tempSprite2.angle = 180;
		tempSprite2.y = imageHeight * 2;
		tempSprite2.x = imageWidth;
		const tempTextureContainer = new pixi.PIXI.Container();
		tempTextureContainer.addChild(tempSprite1);
		tempTextureContainer.addChild(tempSprite2);
		// TODO cache this at module scope? see comment at top of file
		const renderTexture = pixi.PIXI.RenderTexture.create({
			width: imageWidth,
			height: imageHeight * 2,
		});
		pixi.app.renderer.render(tempTextureContainer, {renderTexture});
		return new pixi.PIXI.TilingSprite(renderTexture, width, height);
	};
</script>

<InteractiveSurface {width} {height} scale={$scale} {moveCamera} {zoomCamera} {inputEnabled} />
