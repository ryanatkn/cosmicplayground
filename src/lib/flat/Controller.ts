import {writable} from 'svelte/store';

import type {CameraState} from '$lib/flat/camera';
import type {Entity} from '$lib/flat/Entity';

// TODO rethink and handle dynamic mappings

export class Controller {
	// TODO this is too specific for the `Controller`, need to rethink all of this
	moving = writable(false);

	movingLeft = false;
	movingRight = false;
	movingUp = false;
	movingDown = false;

	pointerDown = false;
	setPointerDown(down: boolean): void {
		this.pointerDown = down;
		this.moving.set(this.isMoving());
	}

	// TODO pack this up in a class or something?
	viewportWidth = 0;
	viewportHeight = 0;
	viewWidth = 0;
	viewHeight = 0;
	worldWidth = 0;
	worldHeight = 0;

	pointerScreenX: number | null = null;
	pointerScreenY: number | null = null;
	setPointerLocation(x: number | null, y: number | null): void {
		this.pointerScreenX = x;
		this.pointerScreenY = y;
	}

	private isMoving(): boolean {
		return (
			this.pointerDown || this.movingDown || this.movingUp || this.movingLeft || this.movingRight
		);
	}

	// TODO use the `pressed` bools that are set for one tick
	handleKeydown(key: string): void {
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.movingLeft = true;
				this.moving.set(true);
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.movingRight = true;
				this.moving.set(true);
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.movingUp = true;
				this.moving.set(true);
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.movingDown = true;
				this.moving.set(true);
				break;
			}
			default: {
				console.log('unhandled keydown', key);
			}
		}
	}

	handleKeyup(key: string): void {
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.movingLeft = false;
				this.moving.set(this.isMoving());
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.movingRight = false;
				this.moving.set(this.isMoving());
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.movingUp = false;
				this.moving.set(this.isMoving());
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.movingDown = false;
				this.moving.set(this.isMoving());
				break;
			}
			default: {
				console.log('unhandled keyup', key);
			}
		}
	}
}

const MIN_MAGNITUDE = 5; // TODO this is still janky, see more comments below

// TODO move this where?
// TODO maybe return values instead?
export const updateDirection = (
	controller: Controller,
	entity: Entity,
	camera: CameraState,
): void => {
	if (
		controller.pointerDown &&
		controller.pointerScreenX !== null &&
		controller.pointerScreenY !== null
	) {
		const viewScale = controller.viewWidth / controller.worldWidth;
		const pointerViewX =
			controller.pointerScreenX - controller.viewportWidth / 2 + controller.viewWidth / 2;
		const pointerViewY =
			controller.pointerScreenY - controller.viewportHeight / 2 + controller.viewHeight / 2;
		// TODO cache pointer world coordinates? where?
		const pointerWorldX = pointerViewX / viewScale + camera.x - camera.width / 2;
		const pointerWorldY = pointerViewY / viewScale + camera.y - camera.height / 2;
		const x = pointerWorldX - entity.x;
		const y = pointerWorldY - entity.y;
		const magnitude = Math.hypot(x, y);
		const zeroes = !magnitude || magnitude < MIN_MAGNITUDE * entity.speed; // TODO this is still janky, especially with low fps
		entity.directionX = zeroes ? 0 : x / magnitude;
		entity.directionY = zeroes ? 0 : y / magnitude;
	} else {
		const {movingLeft, movingRight, movingUp, movingDown} = controller;
		const directionX = movingLeft && !movingRight ? -1 : movingRight && !movingLeft ? 1 : 0;
		const directionY = movingUp && !movingDown ? -1 : movingDown && !movingUp ? 1 : 0;
		entity.directionX = directionY === 0 ? directionX : directionX / Math.SQRT2;
		entity.directionY = directionX === 0 ? directionY : directionY / Math.SQRT2;
	}
};
