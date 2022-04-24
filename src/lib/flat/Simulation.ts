import {Collisions, CollisionResult, type FilterPotentials} from '@ryanatkn/collisions';

import type {Entity} from '$lib/flat/Entity';
import type {EntityBody} from '$lib/flat/entityBody';

const result = new CollisionResult();
const potentials: EntityBody[] = [];

export class Simulation {
	readonly collisions: Collisions;
	readonly entities: Set<Entity> = new Set();

	constructor(collisions: Collisions) {
		this.collisions = collisions;
	}

	addEntity(entity: Entity): void {
		this.entities.add(entity);
	}

	removeEntity(entity: Entity): void {
		// TODO BLOCK  wait ... there's a different between
		// removing the body from collisions and destroying the entity,
		// do we want to call `entity.destroy` here?
		entity.body.remove();
		this.entities.delete(entity);
	}

	update(
		dt: number,
		collide: (entityA: Entity, entityB: Entity, result: CollisionResult) => void,
		filter?: (bodyA: EntityBody, bodyB: EntityBody) => boolean,
	): void {
		this.collisions.update();
		const {entities} = this;

		let speed: number;

		// apply collisions
		for (const entityA of entities) {
			if (entityA.disableSimulation) continue;
			speed = entityA.speed * dt;

			entityA.x += entityA.directionX * speed;
			entityA.y += entityA.directionY * speed;

			potentials.length = 0;
			entityA.body.potentials(filter as FilterPotentials, potentials);

			for (const bodyB of potentials) {
				if (entityA.body.collides(bodyB, result)) {
					collide(entityA, bodyB.entity, result);
				}
			}
		}
	}
}
