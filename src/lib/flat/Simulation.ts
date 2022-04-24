import {Collisions, CollisionResult, type FilterPotentials} from '@ryanatkn/collisions';

import type {EntityBody} from '$lib/flat/entityBody';

const result = new CollisionResult();
const potentials: EntityBody[] = [];

// TODO should this be a Svelte store? or a Svelte component?

// TODO BLOCK should the simulation act on bodies or entities?
// maybe we don't want to extend the collision systems objects at all?

export class Simulation {
	readonly collisions: Collisions;
	readonly bodies: Set<EntityBody> = new Set();

	constructor(collisions: Collisions) {
		this.collisions = collisions;
	}

	addBody(body: EntityBody): void {
		this.bodies.add(body);
	}

	removeBody(body: EntityBody): void {
		body.remove();
		this.bodies.delete(body);
	}

	update(
		dt: number,
		collide: (bodyA: EntityBody, bodyB: EntityBody, result: CollisionResult) => void,
		filter?: (bodyA: EntityBody, bodyB: EntityBody) => boolean,
	): void {
		this.collisions.update();
		const {bodies} = this;

		let speed: number;

		// apply collisions
		for (const bodyA of bodies) {
			if (bodyA.disableSimulation) continue;
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
