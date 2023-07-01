<script lang="ts">
	import {writable} from 'svelte/store';

	const ZOOM_SCALING_FACTOR = 1.1;

	// These properties are not reactive.
	// To update after mounting, set the stores below directly.
	export let initialX = 0;
	export let initialY = 0;
	export let initialWidth = 0;
	export let initialHeight = 0;
	export let initialScale = 1;

	export const x = writable(initialX);
	export const y = writable(initialY);
	export const width = writable(initialWidth);
	export const height = writable(initialHeight);
	export const scale = writable(initialScale);

	export const zoomCamera = (
		zoomDirection: number,
		pivotX: number = $width / 2,
		pivotY: number = $height / 2,
		multiplier = 1, // TODO this is hacky, added for pinch-to-zoom, should support with the wheel event usage too and be merged with `zoomDirection`
	): void => {
		if (zoomDirection === 0) return;
		const scaleAmount = zoomDirection > 0 ? 1 / ZOOM_SCALING_FACTOR : ZOOM_SCALING_FACTOR;
		const oldScale = $scale;
		const newScale = oldScale * scaleAmount;
		$scale = newScale;

		// Center relative to the pivot point.
		// When zooming with the mouse, this is the mouse's screen position.
		const scaleRatio = multiplier * ((newScale - oldScale) / oldScale);
		// TODO BLOCK this is busted
		console.log(`scaleRatio`, scaleRatio);
		const mouseDistX = pivotX - $width / 2;
		const mouseDistY = pivotY - $height / 2;
		const dx = (mouseDistX * scaleRatio) / newScale;
		const dy = (mouseDistY * scaleRatio) / newScale;
		moveCamera(dx, dy);
	};

	export const moveCamera = (dx: number, dy: number): void => {
		$x += dx;
		$y += dy;
	};
</script>
