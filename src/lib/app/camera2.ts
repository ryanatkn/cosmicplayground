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
	zoom_camera: (zoomDirection: number, pivotX?: number, pivotY?: number) => void;
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
			zoomDirection: number,
			pivotX: number = get(width) / 2,
			pivotY: number = get(height) / 2,
		): void => {
			if (zoomDirection === 0) return;
			const scaleAmount = zoomDirection > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
			const oldScale = get(scale);
			const newScale = oldScale * scaleAmount;
			scale.set(newScale);

			// Center relative to the pivot point.
			// When zooming with the mouse, this is the mouse's screen position.
			const scaleRatio = (newScale - oldScale) / oldScale;
			const mouseDistX = pivotX - get(width) / 2;
			const mouseDistY = pivotY - get(height) / 2;
			const dx = (mouseDistX * scaleRatio) / newScale;
			const dy = (mouseDistY * scaleRatio) / newScale;
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
