import {Collisions, CollisionResult, type FilterPotentials} from '@ryanatkn/collisions';

import type {EntityBody} from '$lib/flat/entity';

const result = new CollisionResult();

// TODO should this be a Svelte store? or a Svelte component?

export class Simulation {
	readonly collisions: Collisions;
	readonly bodies: EntityBody[] = []; // TODO

	constructor(collisions: Collisions) {
		this.collisions = collisions;
	}

	addBody(body: EntityBody): void {
		this.bodies.push(body);
	}

	removeBody(body: EntityBody): void {
		body.remove();
		this.bodies.splice(this.bodies.indexOf(body), 1);
	}

	update(
		dt: number,
		collide: (bodyA: EntityBody, bodyB: EntityBody, result: CollisionResult) => void,
		filter?: (bodyA: EntityBody, bodyB: EntityBody) => boolean,
	): void {
		this.collisions.update();
		const {bodies} = this;

		let speed: number;
		const potentials: EntityBody[] = [];

		// apply collisions
		for (const bodyA of bodies) {
			speed = bodyA.speed * dt;

			bodyA.x += bodyA.directionX * speed;
			bodyA.y += bodyA.directionY * speed;

			potentials.length = 0;
			bodyA.potentials(filter as FilterPotentials, potentials);

			for (const bodyB of potentials) {
				if (bodyA.collides(bodyB, result)) {
					collide(bodyA, bodyB, result);
				}
			}
		}
	}
}
