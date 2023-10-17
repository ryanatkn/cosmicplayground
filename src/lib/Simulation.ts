import type {Collisions, CollisionResult, FilterPotentials} from '@ryanatkn/collisions';

import type {Entity} from '$lib/entity.js';
import type {EntityBody} from '$lib/entityBody';
import {collisionResult} from '$lib/entityHelpers';

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
		entity.body.remove();
		this.entities.delete(entity);
	}

	update(
		dt: number,
		collide: (entityA: Entity, entityB: Entity, collisionResult: CollisionResult) => void,
		filter?: (bodyA: EntityBody, bodyB: EntityBody) => boolean,
	): void {
		this.collisions.update();

		let speed: number;

		// simulate each entitity
		// TODO consider batching by component (ECS)
		for (const entityA of this.entities) {
			if (entityA.disableSimulation) continue;
			speed = entityA.speed * dt;

			// TODO this moves one entity and then tests for collisions,
			// but we're calling `collisions.update()` above --
			// will we get better behavior if we move everything first,
			// then update the collisions, then test for collisions?
			entityA.x += entityA.directionX * speed;
			entityA.y += entityA.directionY * speed;

			if (!entityA.ghostly) {
				potentials.length = 0;
				entityA.body.potentials(filter as FilterPotentials, potentials);

				for (const bodyB of potentials) {
					if (bodyB.entity.ghostly) continue; // TODO should this be part of the filter?
					if (entityA.body.collides(bodyB, collisionResult)) {
						collide(entityA, bodyB.entity, collisionResult);
						if (entityA.dead) break;
					}
				}
			}
		}
	}
}
