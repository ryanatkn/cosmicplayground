import {writable, type Writable, get} from 'svelte/store';

// TODO This is currently unused, and `Camera.svelte` is used in its place.
// The downside of the Svelte component is that initialization becomes much more complex,
// because the camera and its values aren't ready when the parent component is initializing,
// but there are some benefits worth exploring. We can always revert to this class if needed.

export interface Camera2 {
	x: Writable<number>;
	y: Writable<number>;
	width: Writable<number>;
	height: Writable<number>;
	scale: Writable<number>;
	move_camera: (dx: number, dy: number) => void;
	zoom_camera: (direction: number, pivot_x?: number, pivot_y?: number) => void;
}

const SCALE_FACTOR = 1.1;

export const createCamera2 = (): Camera2 => {
	const camera: Camera2 = {
		x: writable(0),
		y: writable(0),
		width: writable(0),
		height: writable(0),
		scale: writable(1),
		zoom_camera: (
			direction: number,
			pivot_x: number = get(width) / 2,
			pivot_y: number = get(height) / 2,
		): void => {
			if (direction === 0) return;
			const scale_amount = direction > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
			const old_scale = get(scale);
			const new_scale = old_scale * scale_amount;
			scale.set(new_scale);

			// Center relative to the pivot point.
			// When zooming with the mouse, this is the mouse's screen position.
			const scale_ratio = (new_scale - old_scale) / old_scale;
			const mouse_dist_x = pivot_x - get(width) / 2;
			const mouse_dist_y = pivot_y - get(height) / 2;
			const dx = (mouse_dist_x * scale_ratio) / new_scale;
			const dy = (mouse_dist_y * scale_ratio) / new_scale;
			camera.move_camera(dx, dy);
		},
		move_camera: (dx: number, dy: number): void => {
			x.update(($x) => $x + dx);
			y.update(($y) => $y + dy);
		},
	};

	const {x, y, scale, width, height} = camera;
	return camera;
};
