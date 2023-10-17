import {writable} from 'svelte/store';

import type {EntityCircle} from '$lib/entityBody';
import type {CameraState} from '$lib/camera';
import type {Entity} from '$lib/entity.js';

export class DomCanvasRenderer {
	width = -1;
	height = -1;

	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;

	dirty = writable(false); // TODO hacky, used to rerender when clock is stopped

	// TODO remove 2d canvas, use WebGL instead -- Pixi?
	setCanvas(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
		const ctx = (this.ctx = canvas.getContext('2d'));
		if (!ctx) throw Error('Failed to get canvas context');
		if (this.width !== -1 && this.height !== -1) {
			canvas.width = this.width;
			canvas.height = this.height;
		}
		this.dirty.set(true);
	}

	unsetCanvas(): void {
		this.canvas = null;
		this.ctx = null;
	}

	resize(width: number, height: number): void {
		console.log('[renderer] resize, width, height', width, height);
		this.width = width;
		this.height = height;
		if (this.canvas) {
			this.canvas.width = width;
			this.canvas.height = height;
		}
		this.dirty.set(true);
	}

	// TODO not sure about this API
	clear(): void {
		const {ctx, width, height} = this;
		if (!ctx) throw Error('Expected rendering context');
		if (width === -1 || height === -1) throw Error('Expected renderer dimensions');
		ctx.clearRect(0, 0, width, height);
	}

	render(entities: Iterable<Entity>, camera: CameraState): void {
		const {ctx} = this;
		if (!ctx) throw Error('Expected rendering context');
		if (this.width === -1 || this.height === -1) throw Error('Expected renderer dimensions');

		this.dirty.set(false);

		for (const entity of entities) {
			if (entity.invisible) continue;
			ctx.beginPath();
			ctx.strokeStyle = entity.colorStr || '#fff';
			if (entity.body._circle) {
				drawCircle(ctx, entity.body, camera);
			} else {
				// drawPolygon(ctx, entity, camera);
				throw Error('TODO');
			}
			ctx.stroke();
			if (entity.text) {
				drawText(ctx, entity, camera);
			}
		}
	}

	// TODO batch render? or maybe just use pixi? see in 2 places
	// renderBatch(entities: Iterable<EntityBody>, camera: CameraState): void {
	// 	const {ctx, width, height} = this;
	// 	if (!ctx) throw Error('Expected rendering context');
	// 	if (width === -1 || height === -1) throw Error('Expected renderer dimensions');

	// 	this.dirty.set(false);

	// 	// TODO optimize -- how? Firefox is dropping a lot of frames
	// 	// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
	// 	// round the px?
	// 	// batch?
	// 	ctx.beginPath();
	// 	let setStyle = false;
	// 	for (const entity of entities) {
	// 		if (!setStyle) {
	// 			ctx.strokeStyle = entity.color || '#fff';
	// 			setStyle = true;
	// 		}
	// 		if (entity.invisible || entity.dead) continue;
	// 		if (entity._circle) {
	// 			drawCircle(ctx, entity, camera);
	// 		} else {
	// 			// drawPolygon(ctx, entity, camera);
	// 			throw Error('TODO');
	// 		}
	// 	}
	// 	ctx.stroke();
	//  ctx.closePath(); // TODO not needed?
	// }
}

const drawCircle = (
	ctx: CanvasRenderingContext2D,
	entity: EntityCircle,
	camera: CameraState,
): void => {
	const {x, y} = entity;
	const radius = entity.radius * entity.scale;
	const viewX = (x - camera.x) * camera.scale + camera.width / 2;
	const viewY = (y - camera.y) * camera.scale + camera.height / 2;

	ctx.moveTo(viewX + radius, viewY);
	ctx.arc(viewX, viewY, radius, 0, Math.PI * 2);
};

const drawText = (ctx: CanvasRenderingContext2D, entity: Entity, camera: CameraState): void => {
	const viewX = (entity.x - camera.x) * camera.scale + camera.width / 2 + entity.textOffsetX;
	const viewY = (entity.y - camera.y) * camera.scale + camera.height / 2 + entity.textOffsetY;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = entity.font || '30px sans-serif';
	ctx.fillText(entity.text!, viewX, viewY); // TODO type? maybe pass `text` instead of `entity`?
};
