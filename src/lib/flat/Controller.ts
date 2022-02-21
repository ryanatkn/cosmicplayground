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
	pressingPause = false;

	pointerDown = false;
	setPointerDown(down: boolean): void {
		this.pointerDown = down;
		this.moving.set(this.isMoving());
	}

	pointerLocationX: number | null = null;
	pointerLocationY: number | null = null;
	setPointerLocation(x: number | null, y: number | null): void {
		this.pointerLocationX = x;
		this.pointerLocationY = y;
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
			case '`':
			case ' ': {
				this.pressingPause = true;
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
			case '`':
			case ' ': {
				this.pressingPause = false;
				break;
			}
			default: {
				console.log('unhandled keyup', key);
			}
		}
	}
}

// TODO move this where?
// TODO maybe return values instead?
export const updateDirection = (
	controller: Controller,
	entity: Entity,
	camera: CameraState,
): void => {
	if (controller.pointerDown) {
		if (controller.pointerLocationX === null || controller.pointerLocationY === null) return;
		const x = controller.pointerLocationX - entity.x + camera.x - camera.width / 2;
		const y = controller.pointerLocationY - entity.y + camera.y - camera.height / 2;
		entity.directionX = x / (Math.abs(x) + Math.abs(y));
		entity.directionY = y / (Math.abs(x) + Math.abs(y));
	} else {
		const {movingLeft, movingRight, movingUp, movingDown} = controller;
		const directionX = movingLeft && !movingRight ? -1 : movingRight && !movingLeft ? 1 : 0;
		const directionY = movingUp && !movingDown ? -1 : movingDown && !movingUp ? 1 : 0;
		entity.directionX = directionY === 0 ? directionX : directionX / 2;
		entity.directionY = directionX === 0 ? directionY : directionY / 2;
	}
	console.log(`entity.directionX, entity.directionY`, entity.directionX, entity.directionY);
};
