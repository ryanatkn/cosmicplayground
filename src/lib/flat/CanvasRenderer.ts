import {writable} from 'svelte/store';

import {type Renderer} from '$lib/flat/renderer';
import {type Entity, type EntityCircle} from '$lib/flat/entity';
import {type CameraState} from '$lib/flat/camera';

export class CanvasRenderer implements Renderer {
	width = -1;
	height = -1;

	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;

	dirty = writable(false); // TODO hacky, used to rerender when clock is stopped

	// TODO remove 2d canvas, use WebGL instead -- Pixi?
	setCanvas(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		if (!this.ctx) throw Error('Failed to get canvas context');
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

	render(entities: Entity[], camera: CameraState): void {
		const {ctx, width, height} = this;
		if (!ctx) throw Error('Expected rendering context');
		if (width === -1 || height === -1) throw Error('Expected renderer dimensions');

		this.dirty.set(false);

		for (const entity of entities) {
			if (entity.invisible) continue;
			// TODO batch these draws (or just switch to WebGL?) nah support both
			ctx.beginPath();
			ctx.strokeStyle = entity.color || '#fff';
			if (entity._circle) {
				this.drawCircle(ctx, entity as EntityCircle, camera); // TODO fix type narrowing
			} else {
				entity.draw(ctx);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}

	drawCircle(context: CanvasRenderingContext2D, entity: EntityCircle, camera: CameraState): void {
		const x = entity.x;
		const y = entity.y;
		const radius = entity.radius * entity.scale;
		// TODO adjust for camera
		const viewX = (x - camera.x) * camera.scale + camera.width / 2;
		const viewY = (y - camera.y) * camera.scale + camera.height / 2;
		// context.moveTo(x + radius, y);
		// context.arc(x, y, radius, 0, Math.PI * 2);

		context.moveTo(viewX + radius, viewY);
		context.arc(viewX, viewY, radius, 0, Math.PI * 2);
	}
}
