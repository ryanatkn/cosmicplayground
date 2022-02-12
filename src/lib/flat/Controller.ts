import {type Entity} from '$lib/flat/entity';

// TODO rethink and handle dynamic mappings

export class Controller {
	moving_left = false;
	moving_right = false;
	moving_up = false;
	moving_down = false;
	pressing_exit = false;

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
				this.moving_left = true;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.moving_right = true;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.moving_up = true;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.moving_down = true;
				break;
			}
			case 'Escape': {
				this.pressing_exit = true;
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
				this.moving_left = false;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				this.moving_right = false;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				this.moving_up = false;
				break;
			}
			case 'ArrowDown':
			case 's': {
				this.moving_down = false;
				break;
			}
			case 'Escape': {
				this.pressing_exit = false;
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
			controller.moving_left && !controller.moving_right
				? -1
				: controller.moving_right && !controller.moving_left
				? 1
				: 0;
		entity.directionY =
			controller.moving_up && !controller.moving_down
				? -1
				: controller.moving_down && !controller.moving_up
				? 1
				: 0;
	}
};
