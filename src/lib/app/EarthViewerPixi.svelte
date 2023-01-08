<script lang="ts">
	import * as Pixi from 'pixi.js';

	import {computeBlendedImagesContinuumOpacities} from '$lib/app/blendedImagesContinuum';
	import {
		computeBlendedImagesCycleOpacities,
		computeBlendedImagesCycleZIndex,
	} from '$lib/app/blendedImagesCycle';
	import {getPixiScene} from '$lib/app/pixi';
	import InteractiveSurface from '$lib/app/InteractiveSurface.svelte';
	import type Camera from '$lib/app/Camera.svelte';

	// TODO looks like we could use `Pixi.Prepare` to make initial rendering smoother:
	// https://pixijs.download/release/docs/PIXI.Prepare.html

	// TODO should we cache stuff at the module scope? mainly thinking of the render textures
	// or should we free all resources when this is unmounted? including all base textures?

	export let camera: Camera;
	export let inputEnabled = true;
	export let landImages: string[]; // not reactive
	export let seaImages: string[]; // not reactive
	export let shoreImage: string | undefined = undefined; // not reactive
	export let shoreImageCount: number | undefined = undefined; //not reactive
	export let seashoreFloorIndex: number | undefined = undefined;
	export let lightsImage: string | undefined = undefined; // not reactive
	export let lightsOpacity = 0;
	export let nightfallOpacity = 0;
	export let showLights = false;
	export let activeLandValue: number;
	export let activeSeaLevel: number;
	export let imageWidth: number; // not reactive
	export let imageHeight: number; // not reactive

	if (!shoreImage && shoreImageCount === undefined) {
		throw Error('shoreImage must be paired with a shoreImageCount');
	}

	$: ({x, y, width, height, scale} = camera);

	const [pixi] = getPixiScene({
		load: (loader) => {
			for (const landImage of landImages) {
				if (!loader.resources[landImage]) loader.add(landImage);
			}
			for (const seaImage of seaImages) {
				if (!loader.resources[seaImage]) loader.add(seaImage);
			}
			if (shoreImage) {
				if (!loader.resources[shoreImage]) loader.add(shoreImage);
			}
			if (lightsImage) {
				if (!loader.resources[lightsImage]) loader.add(lightsImage);
			}
		},
		loaded: (scene, resources, _loader) => {
			mapContainer = new Pixi.Container();
			scene.addChild(mapContainer);

			landContainer = new Pixi.Container();
			mapContainer.addChild(landContainer);
			landContainer.sortableChildren = true;
			for (const landImage of landImages) {
				const sprite = createMapSprite(resources[landImage]!.texture!);
				landContainer.addChild(sprite);
				landSprites.push(sprite);
			}
			updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);
			updateLandOpacities(activeLandValue);

			seashoreContainer = new Pixi.Container();
			mapContainer.addChild(seashoreContainer);
			for (const seaImage of seaImages) {
				const sprite = createMapSprite(resources[seaImage]!.texture!);
				seashoreContainer.addChild(sprite);
				seaSprites.push(sprite);
			}
			if (shoreImage) {
				shoreSprite = createMapSprite(resources[shoreImage]!.texture!);
				seashoreContainer.addChild(shoreSprite);
				const shaderFrag = `
					uniform float alpha;

					varying vec2 vTextureCoord;
					uniform sampler2D uSampler;

					void main() {
						vec4 color = texture2D(uSampler, vTextureCoord);
						color *= 0.7;
						gl_FragColor = color;
					}
				`;
				const filter = new Pixi.Filter(undefined, shaderFrag, {alpha: 0.3});
				shoreSprite.filters = [filter];
				// filter.uniforms.alpha = 0.6; TODO BLOCK
			}
			updateSpriteTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
			updateSeaOpacities(activeSeaLevel);

			if (lightsImage) {
				overlayContainer = new Pixi.Container();
				mapContainer.addChild(overlayContainer);

				const nightfallSprite = new Pixi.TilingSprite(Pixi.Texture.WHITE, $width, $height);
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

	const landSprites: Pixi.TilingSprite[] = []; // not reactive
	const seaSprites: Pixi.TilingSprite[] = []; // not reactive
	let shoreSprite: Pixi.TilingSprite | undefined = undefined; // not reactive
	const overlaySprites: Pixi.TilingSprite[] = []; // not reactive
	let mapContainer: Pixi.Container;
	let landContainer: Pixi.Container;
	let seashoreContainer: Pixi.Container; // includes shore sprites
	let overlayContainer: Pixi.Container;

	$: tilePositionX = -$x * $scale + $width / 2;
	$: tilePositionY = -$y * $scale + $height / 2;

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
	$: updateSpriteDimensions(landSprites, $width, $height);
	$: updateSpriteDimensions(seaSprites, $width, $height);
	$: shoreSprite && updateSpriteDimensions([shoreSprite], $width, $height); // TODO BLOCK remove wrapper array
	$: updateSpriteDimensions(overlaySprites, $width, $height);
	const updateSpriteDimensions = (sprites: Pixi.TilingSprite[], width: number, height: number) => {
		for (const sprite of sprites) {
			sprite.width = width;
			sprite.height = height;
		}
	};
	$: updateSpriteTransforms(landSprites, tilePositionX, tilePositionY, $scale);
	$: updateSpriteTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
	$: shoreSprite && updateSpriteTransforms([shoreSprite], tilePositionX, tilePositionY, $scale); // TODO BLOCK remove wrapper array
	$: updateSpriteTransforms(overlaySprites, tilePositionX, tilePositionY, $scale);
	const updateSpriteTransforms = (
		sprites: Pixi.TilingSprite[],
		tilePositionX: number,
		tilePositionY: number,
		$scale: number,
	) => {
		for (const sprite of sprites) {
			sprite.tileScale.set($scale);
			sprite.tilePosition.set(tilePositionX, tilePositionY);
		}
	};

	const seashoreImageCount = seaImages.length + (shoreImage ? shoreImageCount! : 0);
	const seashoreOpacities = new Array(seashoreImageCount);
	$: if (seaSprites.length) updateSeaOpacities(activeSeaLevel);
	const updateSeaOpacities = (activeSeaLevel: number) => {
		computeBlendedImagesContinuumOpacities(
			seashoreImageCount,
			activeSeaLevel,
			seashoreOpacities, // mutate the existing opacities
			seashoreFloorIndex,
		);
		// TODO BLOCK set shader values for `seashoreOpacities[0 to (shoreImageCount-1)]`
		for (let i = 0; i < seaSprites.length; i++) {
			seaSprites[i].alpha = seashoreOpacities[i + (shoreImageCount || 0)];
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

	const createMapSprite = (texture: Pixi.Texture) => {
		const tempSprite1 = new Pixi.Sprite(texture);
		const tempSprite2 = new Pixi.Sprite(texture);
		tempSprite2.angle = 180;
		tempSprite2.y = imageHeight * 2;
		tempSprite2.x = imageWidth;
		const tempTextureContainer = new Pixi.Container();
		tempTextureContainer.addChild(tempSprite1);
		tempTextureContainer.addChild(tempSprite2);
		// TODO cache this at module scope? see comment at top of file
		const renderTexture = Pixi.RenderTexture.create({
			width: imageWidth,
			height: imageHeight * 2,
		});
		pixi.app.renderer.render(tempTextureContainer, {renderTexture});
		return new Pixi.TilingSprite(renderTexture, $width, $height);
	};
</script>

<InteractiveSurface
	width={$width}
	height={$height}
	scale={$scale}
	moveCamera={camera.moveCamera}
	zoomCamera={camera.zoomCamera}
	{inputEnabled}
/>
