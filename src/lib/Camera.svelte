<script lang="ts">
	import {writable} from 'svelte/store';

	const ZOOM_SENSITIVITY = 1.1;

	// These properties are not reactive.
	
	interface Props {
		// To update after mounting, set the stores below directly.
		initialX?: number;
		initialY?: number;
		initialWidth?: number;
		initialHeight?: number;
		initialScale?: number;
	}

	let {
		initialX = 0,
		initialY = 0,
		initialWidth = 0,
		initialHeight = 0,
		initialScale = 1
	}: Props = $props();

	export const x = writable(initialX);
	export const y = writable(initialY);
	export const width = writable(initialWidth);
	export const height = writable(initialHeight);
	export const scale = writable(initialScale);

	export const zoom_camera = (
		direction: number,
		pivot_x: number = $width / 2,
		pivot_y: number = $height / 2,
		sensitivity = ZOOM_SENSITIVITY, // TODO this is hacky, added for pinch-to-zoom, should support with the wheel event usage too and be merged with `direction`
	): void => {
		if (direction === 0) return;
		const scale_amount = direction > 0 ? 1 / sensitivity : sensitivity;
		const old_scale = $scale;
		const new_scale = old_scale * scale_amount;
		$scale = new_scale;

		// Center relative to the pivot point.
		// When zooming with the mouse, this is the mouse's screen position.
		const scale_ratio = (new_scale - old_scale) / old_scale;
		const mouse_dist_x = pivot_x - $width / 2;
		const mouse_dist_y = pivot_y - $height / 2;
		const dx = (mouse_dist_x * scale_ratio) / new_scale;
		const dy = (mouse_dist_y * scale_ratio) / new_scale;
		move_camera(dx, dy);
	};

	export const move_camera = (dx: number, dy: number): void => {
		$x += dx;
		$y += dy;
	};
</script>
