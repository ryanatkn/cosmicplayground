import {writable} from 'svelte/store';

import {type Entity} from '$lib/flat/entity';
import {type CameraState} from '$lib/flat/camera';

// TODO rethink and handle dynamic mappings

export class Controller {
	// TODO this is too specific for the `Controller`, need to rethink all of this
	moving = writable(false);

	movingLeft = false;
	movingRight = false;
	movingUp = false;
	movingDown = false;
	pressingExit = false;

	pointerDown = false;
	setPointerDown(down: boolean): void {
		this.pointerDown = down;
		this.moving.set(this.isMoving());
	}

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
			case 'Escape': {
				this.pressingExit = true;
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
			case 'Escape': {
				this.pressingExit = false;
				break;
			}
			default: {
				console.log('unhandled keyup', key);
			}
		}
	}
}

const MIN_MAGNITUDE = 4; // TODO this is still janky

// TODO move this where?
// TODO maybe return values instead?
export const updateDirection = (
	controller: Controller,
	entity: Entity,
	camera: CameraState,
): void => {
	if (controller.pointerDown) {
		if (controller.pointerScreenX === null || controller.pointerScreenY === null) return;
		// TODO cache pointer world coordinates? where?
		const pointerWorldX = controller.pointerScreenX + camera.x - camera.width / 2;
		const pointerWorldY = controller.pointerScreenY + camera.y - camera.height / 2;
		const x = pointerWorldX - entity.x;
		const y = pointerWorldY - entity.y;
		const magnitude = Math.hypot(x, y);
		const zeroes = !magnitude || magnitude < MIN_MAGNITUDE;
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
