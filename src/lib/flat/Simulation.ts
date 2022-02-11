import {Collisions} from '@ryanatkn/collisions';

import {type EntityBody} from '$lib/flat/entity';

const result = Collisions.createResult();

// TODO should this be a Svelte store? or a Svelte component?

export class Simulation {
	readonly collisions: Collisions;
	readonly bodies: EntityBody[] = []; // TODO

	constructor(collisions: Collisions) {
		this.collisions = collisions;
	}

	update(dt: number): void {
		this.collisions.update();
		const {bodies} = this;

		let speed: number;
		let direction_x: number;
		let direction_y: number;
		let potentials: EntityBody[];
		let body: EntityBody;

		// apply collisions
		for (let i = 0; i < bodies.length; ++i) {
			body = bodies[i];
			if (body.ghostly) continue;

			speed = body.speed * dt;
			direction_x = body.direction_x;
			direction_y = body.direction_y;

			body.x += direction_x * speed;
			body.y += direction_y * speed;

			// TODO fix these types in the collisions library
			potentials = body.potentials() as any; // TODO pass in array arg, like the pattern with `result`

			for (const body2 of potentials) {
				if (body2.ghostly) continue;
				if (body.collides(body2 as any, result)) {
					const overlap_x = result.overlap! * result.overlap_x;
					const overlap_y = result.overlap! * result.overlap_y;
					const body2_pct = body2.speed / (body2.speed + body.speed);
					const body1_pct = 1 - body2_pct;
					body.x -= body1_pct * overlap_x;
					body.y -= body1_pct * overlap_y;
					body2.x += body2_pct * overlap_x;
					body2.y += body2_pct * overlap_y;

					// TODO delete this after figuring out where to use similar concepts
					// dot = direction_x * result.overlap_y + direction_y * -result.overlap_x;

					// body.direction_x = 2 * dot * result.overlap_y - direction_x;
					// body.direction_y = 2 * dot * -result.overlap_x - direction_y;

					// dot = body2.direction_x * result.overlap_y + body2.direction_y * -result.overlap_x;

					// body2.direction_x = 2 * dot * result.overlap_y - body2.direction_x;
					// body2.direction_y = 2 * dot * -result.overlap_x - body2.direction_y;
				}
			}
		}
	}
}
