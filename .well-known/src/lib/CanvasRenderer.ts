import {draw_circle, draw_polygon} from '@ryanatkn/collisions';

import type {Renderer} from '$lib/renderer';
import type {Entity} from '$lib/entity.js';

export class CanvasRenderer implements Renderer {
	width = -1;
	height = -1;

	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;

	// TODO remove 2d canvas, use WebGL instead -- Pixi?
	setCanvas(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		if (!this.ctx) throw Error('Failed to get canvas context');
		if (this.width !== -1 && this.height !== -1) {
			canvas.width = this.width;
			canvas.height = this.height;
		}
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
	}

	// TODO not sure about this API
	clear(): void {
		const {ctx, width, height} = this;
		if (!ctx) throw Error('Expected rendering context');
		if (width === -1 || height === -1) throw Error('Expected renderer dimensions');

		ctx.clearRect(0, 0, width, height);
	}

	render(entities: Iterable<Entity>): void {
		const {ctx, width, height} = this;
		if (!ctx) throw Error('Expected rendering context');
		if (width === -1 || height === -1) throw Error('Expected renderer dimensions');

		for (const entity of entities) {
			if (entity.invisible) continue;
			// TODO batch these draws (or just switch to WebGL?)
			ctx.beginPath();
			ctx.strokeStyle = entity.colorStr || '#fff';
			if (entity.body._circle) {
				draw_circle(entity as any, ctx); // TODO type and maybe use `drawBodies` or add `drawBody`
			} else {
				draw_polygon(entity as any, ctx); // TODO type and maybe use `drawBodies` or add `drawBody`
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
}
