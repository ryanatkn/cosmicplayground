<script lang="ts">
	import { run } from 'svelte/legacy';

	import {Filter, Texture, RenderTexture} from '@pixi/core';
	import {Sprite} from '@pixi/sprite';
	import {Container} from '@pixi/display';
	import {TilingSprite} from '@pixi/sprite-tiling';
	import {Assets} from '@pixi/assets';

	import {computeBlendedImagesContinuumOpacities} from '$lib/blendedImagesContinuum.js';
	import {
		computeBlendedImagesCycleOpacities,
		computeBlendedImagesCycleZIndex,
	} from '$lib/blendedImagesCycle.js';
	import {get_pixi_scene} from '$lib/pixi.js';
	import Surface2 from '$lib/Surface2.svelte';
	import type Camera from '$lib/Camera.svelte';

	// TODO looks like we could use `Pixi.Prepare` to make initial rendering smoother:
	// https://pixijs.download/release/docs/PIXI.Prepare.html

	// TODO should we cache stuff at the module scope? mainly thinking of the render textures
	

	interface Props {
		// or should we free all resources when this is unmounted? including all base textures?
		camera: Camera;
		input_enabled?: boolean;
		landImages: string[]; // not reactive
		seaImages: string[]; // not reactive
		shoreImage?: string | undefined; // not reactive
		shoreImageCount?: number | undefined; //not reactive
		seashoreFloorIndex?: number | undefined;
		lightsImage?: string | undefined; // not reactive
		lightsOpacity?: number;
		nightfallOpacity?: number;
		showLights?: boolean;
		activeLandValue: number;
		activeSeaLevel: number;
		imageWidth: number; // not reactive
		imageHeight: number; // not reactive
	}

	let {
		camera,
		input_enabled = true,
		landImages,
		seaImages,
		shoreImage = undefined,
		shoreImageCount = undefined,
		seashoreFloorIndex = undefined,
		lightsImage = undefined,
		lightsOpacity = 0,
		nightfallOpacity = 0,
		showLights = false,
		activeLandValue,
		activeSeaLevel,
		imageWidth,
		imageHeight
	}: Props = $props();

	if (shoreImage && shoreImageCount === undefined) {
		throw Error('shoreImageCount is required to be paired with shoreImage');
	}


	const {pixi} = get_pixi_scene({
		load: async () => {
			// TODO maybe use a manifest/bundle
			const promises: Array<Promise<any>> = [];
			for (const landImage of landImages) {
				promises.push(Assets.load(landImage));
			}
			for (const seaImage of seaImages) {
				promises.push(Assets.load(seaImage));
			}
			if (shoreImage) {
				promises.push(Assets.load(shoreImage));
			}
			if (lightsImage) {
				promises.push(Assets.load(lightsImage));
			}
			await Promise.all(promises);
		},
		loaded: async (scene) => {
			mapContainer = new Container();
			scene.addChild(mapContainer);

			landContainer = new Container();
			mapContainer.addChild(landContainer);
			landContainer.sortableChildren = true;
			for (const landImage of landImages) {
				const sprite = createMapSprite(Assets.get(landImage));
				landContainer.addChild(sprite);
				landSprites.push(sprite);
			}
			updateSpritesTransforms(landSprites, tilePositionX, tilePositionY, $scale);
			updateLandOpacities(activeLandValue);

			seashoreContainer = new Container();
			mapContainer.addChild(seashoreContainer);
			for (const seaImage of seaImages) {
				const sprite = createMapSprite(Assets.get(seaImage));
				seashoreContainer.addChild(sprite);
				seaSprites.push(sprite);
			}
			if (shoreImage) {
				shoreSprite = createMapSprite(Assets.get(shoreImage));
				seashoreContainer.addChild(shoreSprite);
				const filter = new Filter(undefined, shaderFrag, toAlphaValues(shoreImageCount!));
				shoreSprite.filters = [filter];
			}
			updateSpritesTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
			updateSeaOpacities(activeSeaLevel);

			if (lightsImage) {
				overlayContainer = new Container();
				mapContainer.addChild(overlayContainer);

				const nightfallSprite = new TilingSprite(Texture.WHITE, $width, $height);
				nightfallSprite.tint = 0x000000;
				nightfallSprite.alpha = 0;
				overlayContainer.addChild(nightfallSprite);
				overlaySprites.push(nightfallSprite);

				const lightsSprite = createMapSprite(Assets.get(lightsImage));
				lightsSprite.alpha = 0;
				overlayContainer.addChild(lightsSprite);
				overlaySprites.push(lightsSprite);

				updateSpritesTransforms(overlaySprites, tilePositionX, tilePositionY, $scale);
			}
		},
		destroy: () => {
			console.log('destroyed earth');
			// k
		},
	});

	const landSprites: TilingSprite[] = []; // not reactive
	const seaSprites: TilingSprite[] = $state([]); // not reactive
	let shoreSprite: TilingSprite | undefined = $state(undefined); // not reactive
	const overlaySprites: TilingSprite[] = []; // not reactive
	let mapContainer: Container;
	let landContainer: Container;
	let seashoreContainer: Container; // includes shore sprites
	let overlayContainer: Container = $state();


	const updateSpritesDimensions = (sprites: TilingSprite[], width: number, height: number) => {
		for (const sprite of sprites) {
			updateSpriteDimensions(sprite, width, height);
		}
	};
	const updateSpriteDimensions = (sprite: TilingSprite, width: number, height: number) => {
		sprite.width = width;
		sprite.height = height;
	};
	const updateSpritesTransforms = (
		sprites: TilingSprite[],
		tilePositionX: number,
		tilePositionY: number,
		$scale: number,
	) => {
		for (const sprite of sprites) {
			updateSpriteTransforms(sprite, tilePositionX, tilePositionY, $scale);
		}
	};
	const updateSpriteTransforms = (
		sprite: TilingSprite,
		tilePositionX: number,
		tilePositionY: number,
		$scale: number,
	) => {
		sprite.tileScale.set($scale);
		sprite.tilePosition.set(tilePositionX, tilePositionY);
	};

	const toAlphaValues = (count: number, values?: number[]) => {
		const alphaValues: Record<string, number> = {};
		for (let i = 0; i < count; i++) {
			alphaValues['alpha' + i] = values ? values[count - 1 - i] : 0; // `values` are reversed
		}
		return alphaValues;
	};
	const shaderFrag = `
		// TODO array of values, this is hacky for lack of knowledge
		uniform float alpha1;
		uniform float alpha2;
		uniform float alpha3;
		uniform float alpha4;
		uniform float alpha5;
		uniform float alpha6;
		uniform float alpha7;
		uniform float alpha8;
		uniform float alpha9;
		uniform float alpha10;
		uniform float alpha11;
		uniform float alpha12;
		uniform float alpha13;

		varying vec2 vTextureCoord;
		uniform sampler2D uSampler;

		void main() {
			vec4 color = texture2D(uSampler, vTextureCoord);
			int r = int(floor(color.r / color.a * 255.0 + 0.5));
			if (r == 218) {
				color *= alpha1;
			} else if (r == 202) {
				color *= alpha2;
			} else if (r == 187) {
				color *= alpha3;
			} else if (r == 171) {
				color *= alpha4;
			} else if (r == 151) {
				color *= alpha5;
			} else if (r == 133) {
				color *= alpha6;
			} else if (r == 118) {
				color *= alpha7;
			} else if (r == 104) {
				color *= alpha8;
			} else if (r == 89) {
				color *= alpha9;
			} else if (r == 76) {
				color *= alpha10;
			} else if (r == 72) {
				color *= alpha11;
			} else if (r == 68) {
				color *= alpha12;
			} else if (r == 65) {
				color *= alpha13;
			} else {
				color *= 0.0;
			}
			gl_FragColor = color;
		}
	`;

	const seashoreImageCount = seaImages.length + (shoreImage ? shoreImageCount! : 0);
	const seashoreOpacities = new Array(seashoreImageCount);
	const updateSeaOpacities = (activeSeaLevel: number) => {
		computeBlendedImagesContinuumOpacities(
			seashoreImageCount,
			activeSeaLevel,
			seashoreOpacities, // mutate the existing opacities
			seashoreFloorIndex,
		);
		for (let i = 0; i < seaSprites.length; i++) {
			seaSprites[i].alpha = seashoreOpacities[i + (shoreImageCount || 0)];
		}
		if (shoreSprite) {
			const alphaValues = toAlphaValues(shoreImageCount!, seashoreOpacities);
			const {uniforms} = shoreSprite.filters![0];
			for (const key in alphaValues) {
				uniforms[key] = alphaValues[key];
			}
		}
	};
	const landOpacities = new Array(landImages.length);
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

	const createMapSprite = (texture: Texture) => {
		const tempSprite1 = new Sprite(texture);
		const tempSprite2 = new Sprite(texture);
		tempSprite2.angle = 180;
		tempSprite2.y = imageHeight * 2;
		tempSprite2.x = imageWidth;
		const tempTextureContainer = new Container();
		tempTextureContainer.addChild(tempSprite1);
		tempTextureContainer.addChild(tempSprite2);
		// TODO cache this at module scope? see comment at top of file
		const renderTexture = RenderTexture.create({
			width: imageWidth,
			height: imageHeight * 2,
		});
		pixi.app.renderer.render(tempTextureContainer, {renderTexture});
		return new TilingSprite(renderTexture, $width, $height);
	};
	let {x, y, width, height, scale} = $derived(camera);
	let tilePositionX = $derived(-$x * $scale + $width / 2);
	let tilePositionY = $derived(-$y * $scale + $height / 2);
	run(() => {
		if (overlayContainer) {
			const visible = showLights;
			overlayContainer.visible = visible;
			if (visible) {
				// TODO hacky, maybe save each as a reference?
				// probably want to keep each as a separate opacity instead of setting once on the container
				overlayContainer.children[0].alpha = nightfallOpacity;
				overlayContainer.children[1].alpha = lightsOpacity;
			}
		}
	});
	run(() => {
		updateSpritesDimensions(landSprites, $width, $height);
	});
	run(() => {
		updateSpritesDimensions(seaSprites, $width, $height);
	});
	run(() => {
		shoreSprite && updateSpriteDimensions(shoreSprite, $width, $height);
	});
	run(() => {
		updateSpritesDimensions(overlaySprites, $width, $height);
	});
	run(() => {
		updateSpritesTransforms(landSprites, tilePositionX, tilePositionY, $scale);
	});
	run(() => {
		updateSpritesTransforms(seaSprites, tilePositionX, tilePositionY, $scale);
	});
	run(() => {
		shoreSprite && updateSpriteTransforms(shoreSprite, tilePositionX, tilePositionY, $scale);
	});
	run(() => {
		updateSpritesTransforms(overlaySprites, tilePositionX, tilePositionY, $scale);
	});
	run(() => {
		if (seaSprites.length) updateSeaOpacities(activeSeaLevel);
	});
	run(() => {
		if (landSprites.length) updateLandOpacities(activeLandValue);
	});
</script>

<Surface2
	width={$width}
	height={$height}
	scale={$scale}
	zoom={camera.zoom_camera}
	pan={camera.move_camera}
	disabled={!input_enabled}
/>
