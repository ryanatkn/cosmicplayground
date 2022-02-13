import {type Entity} from '$lib/flat/entity';

// TODO rethink and handle dynamic mappings

export class Controller {
	movingLeft = false;
	movingRight = false;
	movingUp = false;
	movingDown = false;
	pressingExit = false;

	pointerDown = false;
	setPointerDown(down: boolean): void {
		this.pointerDown = down;
	}

	pointerLocationX: number | null = null;
	pointerLocationY: number | null = null;
	setPointerLocation(x: number | null, y: number | null): void {
		this.pointerLocationX = x;
		this.pointerLocationY = y;
	}

	// TODO use the `pressed` bools that are set for one tick
	handle_keydown(key: string): void {
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.movingLeft = true;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.movingRight = true;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.movingUp = true;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.movingDown = true;
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

	handle_keyup(key: string): void {
		switch (key) {
			case 'ArrowLeft':
			case 'a': {
				this.movingLeft = false;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.movingRight = false;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.movingUp = false;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.movingDown = false;
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

// TODO move this where?
// TODO maybe return values instead?
export const updateDirection = (controller: Controller, entity: Entity): void => {
	if (controller.pointerDown) {
		if (controller.pointerLocationX !== null && controller.pointerLocationY !== null) {
			const x = controller.pointerLocationX - entity.x;
			const y = controller.pointerLocationY - entity.y;
			entity.directionX = x / (Math.abs(x) + Math.abs(y));
			entity.directionY = y / (Math.abs(x) + Math.abs(y));
		}
	} else {
		entity.directionX =
			controller.movingLeft && !controller.movingRight
				? -1
				: controller.movingRight && !controller.movingLeft
				? 1
				: 0;
		entity.directionY =
			controller.movingUp && !controller.movingDown
				? -1
				: controller.movingDown && !controller.movingUp
				? 1
				: 0;
	}
};
