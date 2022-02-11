import {type Entity} from '$lib/flat/entity';

// TODO rethink and handle dynamic mappings

export class Controller {
	moving_left: boolean = false;
	moving_right: boolean = false;
	moving_up: boolean = false;
	moving_down: boolean = false;
	pressing_exit: boolean = false;

	pointerDown: boolean = false;
	setPointerDown(down: boolean) {
		this.pointerDown = down;
	}

	pointerLocationX: number | null = null;
	pointerLocationY: number | null = null;
	setPointerLocation(x: number | null, y: number | null) {
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
export const updateDirection = (controller: Controller, entity: Entity) => {
	if (controller.pointerDown) {
		if (controller.pointerLocationX !== null && controller.pointerLocationY !== null) {
			const x = controller.pointerLocationX - entity.x;
			const y = controller.pointerLocationY - entity.y;
			entity.direction_x = x / (Math.abs(x) + Math.abs(y));
			entity.direction_y = y / (Math.abs(x) + Math.abs(y));
		}
	} else {
		entity.direction_x =
			controller.moving_left && !controller.moving_right
				? -1
				: controller.moving_right && !controller.moving_left
				? 1
				: 0;
		entity.direction_y =
			controller.moving_up && !controller.moving_down
				? -1
				: controller.moving_down && !controller.moving_up
				? 1
				: 0;
	}
};
