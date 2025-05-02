<script lang="ts">
	import {run} from 'svelte/legacy';

	import {random_item, random_float} from '@ryanatkn/belt/random.js';
	import {sineInOut} from 'svelte/easing';
	import {base} from '$app/paths';

	import {clock_context} from '$lib/clock.js';
	import {dimensions_context} from '$lib/dimensions.js';
	import StarlitHammock from '$routes/starlit-hammock/StarlitHammock.svelte';
	import ImagePicker from '$lib/ImagePicker.svelte';
	import FloatingTextButton from '$lib/FloatingTextButton.svelte';
	import {spaceImages, type ImageMeta} from '$lib/images.js';
	import ImageCreditsCaption from '$lib/ImageCreditsCaption.svelte';
	import Surface2 from '$lib/Surface2.svelte';
	import Panel from '$lib/Panel.svelte';
	import AboutPortalPreview from '$routes/starlit-hammock/Preview.svelte';
	import PortalPreview from '$lib/PortalPreview.svelte';

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

	const dimensions = dimensions_context.get();
	let width = $state($dimensions.width);
	let height = $state($dimensions.height);
	run(() => {
		width = $dimensions.width;
	});
	run(() => {
		height = $dimensions.height;
	});

	let show_picker = $state(false);

	let activeImage = $state(random_item(spaceImages));

	const clock = clock_context.get();

	const pick_image = (image: ImageMeta) => {
		activeImage = image;
		show_picker = false;
	};
	const pick_random_image = () => {
		if (spaceImages.length === 1) return; // just in case
		let newImage;
		do {
			newImage = random_item(spaceImages);
		} while (newImage === activeImage);
		pick_image(newImage);
	};
	// TODO maybe navigate history in addition to the list?
	const pick_previous_image = () => {
		const activeIndex = spaceImages.indexOf(activeImage); // TODO maybe store the index and derive `activeImage`?
		const previousIndex = activeIndex === 0 ? spaceImages.length - 1 : activeIndex - 1;
		pick_image(spaceImages[previousIndex]);
	};
	const pick_next_image = () => {
		const activeIndex = spaceImages.indexOf(activeImage); // TODO maybe store the index and derive `activeImage`?
		const nextIndex = activeIndex === spaceImages.length - 1 ? 0 : activeIndex + 1;
		pick_image(spaceImages[nextIndex]);
	};

	// TODO customize and make reactive?
	const scale_min = 0;
	const scale_max = 2;
	const MIN_SCALE_MULT = 5; // for small images, this ensures we can scale at least this multiple of the minimum
	const transition_duration = 60000;
	const WAIT_AFTER_INTERACTION = 1000; // TODO increase
	// const pauseDuration = 0;

	// TODO refactor, probably into a tween store with an external `update` function
	let x: number = $state();
	let y: number = $state();
	let scale: number = $state();
	let target_x: number;
	let target_y: number;
	let target_scale: number;
	let start_x: number;
	let start_y: number;
	let start_scale: number;
	let transition_time = 0;
	let transition_pause_timer = 0;
	const update = (dt: number) => {
		if (transition_pause_timer > 0) {
			transition_pause_timer -= dt;
			if (transition_pause_timer > 0) return;
		}
		transition_time += dt;
		if (transition_time >= transition_duration) {
			transition_time = 0;
			[target_x, target_y, target_scale] = randomTransform(
				width,
				height,
				activeImage.info.width,
				activeImage.info.height,
				scale_min,
				scale_max,
			);
			start_x = x;
			start_y = y;
			start_scale = scale;
		}
		updateTransform(transition_time, transition_duration);
	};
	const updateTransform = (currentTime: number, duration: number) => {
		// TODO could make this a pure function that returns `[x, y, scale]`
		// but currently don't need it, and it'd create a lot of garbage
		const easedValue = sineInOut(currentTime / duration);
		x = start_x + easedValue * (target_x - start_x);
		y = start_y + easedValue * (target_y - start_y);
		scale = start_scale + easedValue * (target_scale - start_scale);
	};
	const randomize = (imageWidth: number, imageHeight: number) => {
		// console.log('randomize', width, height, imageWidth, imageHeight);
		[x, y, scale] = randomTransform(width, height, imageWidth, imageHeight, scale_min, scale_max);
		start_x = x;
		start_y = y;
		start_scale = scale;
		// TODO ensure these are different enough?
		[target_x, target_y, target_scale] = randomTransform(
			width,
			height,
			imageWidth,
			imageHeight,
			scale_min,
			scale_max,
		);
	};
	const randomTransform = (
		width: number,
		height: number,
		imageWidth: number,
		imageHeight: number,
		scaleMin: number,
		scaleMax: number,
	) => {
		// images may be smaller than our values allow,
		// so these calculations ensure it's at least fullscreen with some zoom room
		const actualScaleMin = Math.max(scaleMin, Math.max(width / imageWidth, height / imageHeight));
		const actualScaleMax = Math.max(scaleMax, actualScaleMin * MIN_SCALE_MULT);
		const scale = random_float(actualScaleMin, actualScaleMax);
		const x = random_float(width / 2 / scale, imageWidth - width / 2 / scale);
		const y = random_float(height / 2 / scale, imageHeight - height / 2 / scale);
		return [x, y, scale];
	};

	// TODO clamp instead of randomize when width/height change, but randomize when activeImage changes
	run(() => {
		randomize(activeImage.info.width, activeImage.info.height);
	});
	// $: clampTarget(width, height); // TODO
	run(() => {
		!show_picker && update($clock.dt);
	});

	const onKeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case '1':
				show_picker = !show_picker;
				break;
			case 'ArrowLeft':
				pick_previous_image();
				break;
			case 'ArrowRight':
				pick_next_image();
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				pick_random_image();
				break;
			case ' ':
				randomize(activeImage.info.width, activeImage.info.height);
				break;
		}
	};

	// TODO extract camera store, copypasted from deep-breath
	const SCALE_FACTOR = 1.1;
	const zoom_camera = (
		zoom_direction: number,
		screen_pivot_x: number = width / 2,
		screen_pivot_y: number = height / 2,
	) => {
		if (zoom_direction === 0) return;
		const scale_amount = zoom_direction > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
		const old_scale = scale;
		const new_scale = old_scale * scale_amount;
		scale = new_scale;

		// Center relative to the pivot point.
		// When zooming with the mouse, this is the mouse's screen position.
		const scale_ratio = (new_scale - old_scale) / old_scale;
		const mouse_dist_x = screen_pivot_x - width / 2;
		const mouse_dist_y = screen_pivot_y - height / 2;
		const dx = (mouse_dist_x * scale_ratio) / new_scale;
		const dy = (mouse_dist_y * scale_ratio) / new_scale;
		move_camera(dx, dy);
	};
	const move_camera = (dx: number, dy: number) => {
		x += dx;
		y += dy;

		// TODO where to best do this?
		transition_pause_timer = WAIT_AFTER_INTERACTION;
		transition_time = transition_duration; // force a new transition to be randomized once the pause timer expires
	};
	let camera_x = $derived(-x * scale + width / 2);
	let camera_y = $derived(-y * scale + height / 2);
</script>

<svelte:window onkeydowncapture={onKeydown} />

<!-- TODO probably want a better pattern than this -->
{#if show_picker}
	<div class="overlay-bg"></div>
{/if}

<StarlitHammock
	cameraX={camera_x}
	cameraY={camera_y}
	cameraScale={scale}
	imageUrl={activeImage.info.url}
/>

{#if show_picker}
	<div class="overlay">
		<ImagePicker images={spaceImages} {pick_image} />
		<footer>
			<Panel>
				<div style:font-size="var(--size_lg)">
					<a href="https://www.spacetelescope.org/copyright/">spacetelescope.org/copyright</a>
				</div>
			</Panel>
			<PortalPreview href="{base}/about">
				<AboutPortalPreview />
			</PortalPreview>
		</footer>
	</div>
{:else}
	<div class="interaction-surface-wrapper" style="width: {width}px; height: {height}px;">
		<Surface2 {width} {height} {scale} zoom={zoom_camera} pan={move_camera} />
	</div>
{/if}
<div class="hud idle_fade">
	<!-- TODO showing both of these buttons all the time has a slight UX annoyance
	where the size of the picker toggle changes.
  one fix is to only show "random image" when the picker is closed,
	but I kind of like having that button available while the picker is open.
	A possible fix would be to include a special slot
	with content that's hidden or empty and only used for sizing purposes.
	-->
	<FloatingTextButton onclick={pick_random_image}>random image</FloatingTextButton>
	<FloatingTextButton onclick={() => (show_picker = !show_picker)}>
		{#if show_picker}close image picker{:else}pick an image{/if}
	</FloatingTextButton>
</div>
{#if !show_picker}
	<div class="credits idle_fade">
		<div class="width_md">
			<Panel>
				<ImageCreditsCaption image={activeImage} />
			</Panel>
		</div>
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
		padding-bottom: var(--space_xl7);
	}
</style>
