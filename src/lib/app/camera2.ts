import {writable, type Writable} from 'svelte/store';

export interface Camera2 {
	x: Writable<number>;
	y: Writable<number>;
	width: Writable<number>;
	height: Writable<number>;
	scale: Writable<number>;
	moveCamera: (dx: number, dy: number) => void;
	zoomCamera: (zoomDirection: number, screenPivotX?: number, screenPivotY?: number) => void;
}

const SCALE_FACTOR = 1.1;

export const createCamera2 = (): Camera2 => {
	// TODO BLOCK what if we move camera2 to a component, so we can use subscriptions and everything,
	// and have it export an object with the stores?
	const camera: Camera2 = {
		x: writable(0),
		y: writable(0),
		width: writable(0),
		height: writable(0),
		scale: writable(1),
		zoomCamera: (
			zoomDirection: number,
			screenPivotX: number = width / 2,
			screenPivotY: number = height / 2,
		): void => {
			if (zoomDirection === 0) return;
			const scaleAmount = zoomDirection > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
			const oldScale = $scale;
			const newScale = oldScale * scaleAmount;
			$scale = newScale;

			// Center relative to the pivot point.
			// When zooming with the mouse, this is the mouse's screen position.
			const scaleRatio = (newScale - oldScale) / oldScale;
			const mouseDistX = screenPivotX - width / 2;
			const mouseDistY = screenPivotY - height / 2;
			const dx = (mouseDistX * scaleRatio) / newScale;
			const dy = (mouseDistY * scaleRatio) / newScale;
			camera.moveCamera(dx, dy);
		},
		moveCamera: (dx: number, dy: number): void => {
			$x += dx;
			$y += dy;
		},
	};

	const {x, y, scale} = camera;
	return camera;
};
