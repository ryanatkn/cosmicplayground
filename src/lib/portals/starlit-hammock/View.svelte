<script lang="ts">
	import {randomItem, randomFloat} from '@feltcoop/felt/util/random.js';
	import {sineInOut} from 'svelte/easing';

	import StarlitHammock from './StarlitHammock.svelte';
	import ImagePicker from '$lib/app/ImagePicker.svelte';
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import {spaceImages, type ImageMeta} from '$lib/app/images';
	import {get_clock} from '$lib/app/clockStore';
	import ImageCreditsCaption from '$lib/app/ImageCreditsCaption.svelte';
	import InteractiveSurface from '$lib/app/InteractiveSurface.svelte';
	import Panel from '$lib/app/Panel.svelte';
	import AboutPortalPreview from '../about/Preview.svelte';
	import PortalPreview from '../home/PortalPreview.svelte';

	/*
	
	ideas
	- button to pauset the automatic movement
  - include more data? (like the description text, object names, location, category, distance)
	- custom urls (saved to localStorage)
	- adjust the duration based on distance, within a random range
	- save the last image to storage? (reduces the serendipity of randomness tho)
	- rotation!
	- allow setting the zoom min/max and duration

	*/

	export const portal = undefined;
	export let width: number;
	export let height: number;

	let showPicker = false;

	let activeImage = randomItem(spaceImages);

	const clock = get_clock();

	const pickImage = (image: ImageMeta) => {
		activeImage = image;
		showPicker = false;
	};
	const pickRandomImage = () => {
		if (spaceImages.length === 1) return; // just in case
		let newImage;
		do {
			newImage = randomItem(spaceImages);
		} while (newImage === activeImage);
		pickImage(newImage);
	};
	// TODO maybe navigate history in addition to the list?
	const pickPreviousImage = () => {
		const activeIndex = spaceImages.indexOf(activeImage); // TODO maybe store the index and derive `activeImage`?
		const previousIndex = activeIndex === 0 ? spaceImages.length - 1 : activeIndex - 1;
		pickImage(spaceImages[previousIndex]);
	};
	const pickNextImage = () => {
		const activeIndex = spaceImages.indexOf(activeImage); // TODO maybe store the index and derive `activeImage`?
		const nextIndex = activeIndex === spaceImages.length - 1 ? 0 : activeIndex + 1;
		pickImage(spaceImages[nextIndex]);
	};

	// TODO customize and make reactive?
	const scaleMin = 0;
	const scaleMax = 2;
	const MIN_SCALE_MULT = 5; // for small images, this ensures we can scale at least this multiple of the minimum
	const transitionDuration = 60000;
	const WAIT_AFTER_INTERACTION = 1000; // TODO increase
	// const pauseDuration = 0;
	const easing = sineInOut;

	// TODO refactor, probably into a tween store with an external `update` function
	let x;
	let y;
	let scale;
	let targetX;
	let targetY;
	let targetScale;
	let startX;
	let startY;
	let startScale;
	let transitionTime = 0;
	let transitionPauseTimer = 0;
	const update = (dt) => {
		if (transitionPauseTimer > 0) {
			transitionPauseTimer -= dt;
			if (transitionPauseTimer > 0) return;
		}
		transitionTime += dt;
		if (transitionTime >= transitionDuration) {
			transitionTime = 0;
			[targetX, targetY, targetScale] = randomTransform(
				width,
				height,
				activeImage.info.width,
				activeImage.info.height,
				scaleMin,
				scaleMax,
			);
			startX = x;
			startY = y;
			startScale = scale;
		}
		updateTransform(transitionTime, transitionDuration);
	};
	const updateTransform = (currentTime, duration) => {
		// TODO could make this a pure function that returns `[x, y, scale]`
		// but currently don't need it, and it'd create a lot of garbage
		const easedValue = sineInOut(currentTime / duration);
		x = startX + easedValue * (targetX - startX);
		y = startY + easedValue * (targetY - startY);
		scale = startScale + easedValue * (targetScale - startScale);
	};
	const randomize = (imageWidth, imageHeight) => {
		// console.log('randomize', width, height, imageWidth, imageHeight);
		[x, y, scale] = randomTransform(width, height, imageWidth, imageHeight, scaleMin, scaleMax);
		startX = x;
		startY = y;
		startScale = scale;
		// TODO ensure these are different enough?
		[targetX, targetY, targetScale] = randomTransform(
			width,
			height,
			imageWidth,
			imageHeight,
			scaleMin,
			scaleMax,
		);
	};
	const randomTransform = (width, height, imageWidth, imageHeight, scaleMin, scaleMax) => {
		// images may be smaller than our values allow,
		// so these calculations ensure it's at least fullscreen with some zoom room
		const actualScaleMin = Math.max(scaleMin, Math.max(width / imageWidth, height / imageHeight));
		const actualScaleMax = Math.max(scaleMax, actualScaleMin * MIN_SCALE_MULT);
		const scale = randomFloat(actualScaleMin, actualScaleMax);
		const x = randomFloat(width / 2 / scale, imageWidth - width / 2 / scale);
		const y = randomFloat(height / 2 / scale, imageHeight - height / 2 / scale);
		return [x, y, scale];
	};

	// TODO clamp instead of randomize when width/height change, but randomize when activeImage changes
	$: randomize(activeImage.info.width, activeImage.info.height);
	// $: clampTarget(width, height); // TODO
	$: !showPicker && update($clock.dt);

	const onKeyDown = (e) => {
		switch (e.key) {
			case 'Escape':
				showPicker = !showPicker;
				break;
			case 'ArrowLeft':
				pickPreviousImage();
				break;
			case 'ArrowRight':
				pickNextImage();
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				pickRandomImage();
				break;
			case ' ':
				randomize(activeImage.info.width, activeImage.info.height);
				break;
		}
	};

	// TODO extract camera store, copypasted from deep-breath
	const SCALE_FACTOR = 1.1;
	const zoomCamera = (
		zoomDirection: number,
		screenPivotX: number = width / 2,
		screenPivotY: number = height / 2,
	) => {
		if (zoomDirection === 0) return;
		const scaleAmount = zoomDirection > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
		const oldScale = scale;
		const newScale = oldScale * scaleAmount;
		scale = newScale;

		// Center relative to the pivot point.
		// When zooming with the mouse, this is the mouse's screen position.
		const scaleRatio = (newScale - oldScale) / oldScale;
		const mouseDistX = screenPivotX - width / 2;
		const mouseDistY = screenPivotY - height / 2;
		const dx = (mouseDistX * scaleRatio) / newScale;
		const dy = (mouseDistY * scaleRatio) / newScale;
		moveCamera(dx, dy);
	};
	const moveCamera = (dx: number, dy: number) => {
		x += dx;
		y += dy;

		// TODO where to best do this?
		transitionPauseTimer = WAIT_AFTER_INTERACTION;
		transitionTime = transitionDuration; // force a new transition to be randomized once the pause timer expires
	};
	$: cameraX = -x * scale + width / 2;
	$: cameraY = -y * scale + height / 2;
</script>

<svelte:window on:keydown={onKeyDown} />

<!-- TODO probably want a better pattern than this -->
{#if showPicker}
	<div class="overlay-bg" />
{/if}

<StarlitHammock {cameraX} {cameraY} cameraScale={scale} imageUrl={activeImage.info.url} />

{#if showPicker}
	<div class="overlay">
		<ImagePicker images={spaceImages} {pickImage} />
		<footer>
			<Panel>
				<h2>
					<a href="https://www.spacetelescope.org/copyright/">spacetelescope.org/copyright</a>
				</h2>
			</Panel>
			<PortalPreview href="#about">
				<AboutPortalPreview />
			</PortalPreview>
		</footer>
	</div>
{:else}
	<!-- TODO use <InteractiveSurface> when we allow manual panning/zooming -->
	<div class="interaction-surface-wrapper" style="width: {width}px; height: {height}px;">
		<InteractiveSurface {width} {height} {scale} {zoomCamera} {moveCamera} />
	</div>
{/if}
<div class="hud idle-fade">
	<!-- TODO showing both of these buttons all the time has a slight UX annoyance
	where the size of the picker toggle changes.
  one fix is to only show "random image" when the picker is closed,
	but I kind of like having that button available while the picker is open.
	A possible fix would be to include a special slot
	with content that's hidden or empty and only used for sizing purposes.
	-->
	<FloatingTextButton on:click={pickRandomImage}>random image</FloatingTextButton>
	<FloatingTextButton on:click={() => (showPicker = !showPicker)}>
		{#if showPicker}close image picker{:else}pick an image{/if}
	</FloatingTextButton>
</div>
{#if !showPicker}
	<div class="credits idle-fade">
		<Panel>
			<ImageCreditsCaption image={activeImage} />
		</Panel>
	</div>
{/if}

<style>
	.overlay-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--bg_dark);
	}
	.hud {
		position: fixed;
		top: 0;
		right: 0;
		display: flex;
	}
	.overlay {
		/* TODO better styling */
		position: absolute;
		left: 0;
		top: var(--hud_element_size);
		width: 100%;
	}
	.credits {
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.credits :global(.panel) {
		/* TODO better way to do this? */
		margin-bottom: 0;
	}
	.interaction-surface-wrapper {
		position: absolute;
		left: 0;
		top: 0;
	}
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: var(--spacing_lg);
	}
</style>
