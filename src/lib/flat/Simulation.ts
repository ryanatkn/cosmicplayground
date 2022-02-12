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
		let directionX: number;
		let directionY: number;
		let potentials: EntityBody[];

		// apply collisions
		for (const body of bodies) {
			if (body.ghostly) continue;

			speed = body.speed * dt;
			directionX = body.directionX;
			directionY = body.directionY;

			body.x += directionX * speed;
			body.y += directionY * speed;

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
					// dot = directionX * result.overlap_y + directionY * -result.overlap_x;

					// body.directionX = 2 * dot * result.overlap_y - directionX;
					// body.directionY = 2 * dot * -result.overlap_x - directionY;

					// dot = body2.directionX * result.overlap_y + body2.directionY * -result.overlap_x;

					// body2.directionX = 2 * dot * result.overlap_y - body2.directionX;
					// body2.directionY = 2 * dot * -result.overlap_x - body2.directionY;
				}
			}
		}
	}
}
