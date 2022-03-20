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
	export let inputEnabled: boolean;
	export let landImages: string[]; // not reactive
	export let seaImages: string[]; // not reactive
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

			seaContainer = new pixi.PIXI.Container();
			mapContainer.addChild(seaContainer);
			for (const seaImage of seaImages) {
				const sprite = createMapSprite(resources[seaImage]!.texture!);
				seaContainer.addChild(sprite);
				seaSprites.push(sprite);
			}
			updateSpriteTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
		},
		destroy: (_scene, _loader) => {
			console.log('destroyed earth');
			// k
		},
	});

	const landSprites: PIXI.TilingSprite[] = []; // not reactive
	const seaSprites: PIXI.TilingSprite[] = []; // not reactive
	let mapContainer;
	let landContainer;
	let seaContainer;

	$: tilePositionX = -$x * $scale + width / 2;
	$: tilePositionY = -$y * $scale + height / 2;

	$: updateSpriteDimensions(landSprites, width, height);
	$: updateSpriteDimensions(seaSprites, width, height);
	const updateSpriteDimensions = (sprites: PIXI.TilingSprite[], width: number, height: number) => {
		for (const sprite of sprites) {
			sprite.width = width;
			sprite.height = height;
		}
	};
	$: updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);
	$: updateSpriteTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
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
	// Before changing to a tiling sprite, this was the update logic. Keeping for future reference.
	// $: if (mapContainer) {
	// 	mapContainer.scale.set($scale);
	// 	mapContainer.position.set(-$x * $scale + width / 2, -$y * $scale + height / 2);
	// }

	const seaOpacities = new Array(seaImages.length);
	$: if (seaSprites.length) updateSeaOpacities(activeSeaLevel);
	const updateSeaOpacities = (activeSeaLevel: number) => {
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
