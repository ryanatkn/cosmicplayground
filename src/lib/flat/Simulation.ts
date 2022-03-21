import {Collisions, type Result as CollisionResult} from '$lib/collisions';

import type {EntityBody} from '$lib/flat/entity';

const result = Collisions.createResult();

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
		shouldCollide?: (bodyA: EntityBody, bodyB: EntityBody) => boolean,
	): void {
		this.collisions.update();
		const {bodies} = this;

		let speed: number;
		let potentials: EntityBody[];

		// apply collisions
		for (const bodyA of bodies) {
			speed = bodyA.speed * dt;

			bodyA.x += bodyA.directionX * speed;
			bodyA.y += bodyA.directionY * speed;

			// TODO pass in `shouldCollide` to pre-filter potentials
			// TODO pass in array arg, like the pattern with `result`
			// TODO fix these types in the collisions library
			potentials = bodyA.potentials() as any;

			for (const bodyB of potentials) {
				if (
					(!shouldCollide || shouldCollide(bodyA, bodyB)) &&
					bodyA.collides(bodyB as any, result)
				) {
					collide(bodyA, bodyB, result);
				}
			}
		}
	}
}
