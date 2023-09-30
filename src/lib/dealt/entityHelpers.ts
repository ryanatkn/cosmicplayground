import {random_float} from '@grogarden/util/random.js';
import {CollisionResult, type Collisions} from '@ryanatkn/collisions';

import {Entity} from './entity.js';
import type {EntityCircle} from './entityBody';

export const collisionResult = new CollisionResult();

export const collide = (entityA: Entity, entityB: Entity, result: CollisionResult): void => {
	const overlap_x = result.overlap! * result.overlap_x;
	const overlap_y = result.overlap! * result.overlap_y;
	const body2_pct =
		(entityA.strength / (entityA.strength + entityB.strength)) *
		(entityB.speed / (entityB.speed + entityA.speed)); // TODO add more factors (what? push? weight? inertia?)
	const body1_pct = 1 - body2_pct;
	entityA.x -= body1_pct * overlap_x;
	entityA.y -= body1_pct * overlap_y;
	entityB.x += body2_pct * overlap_x;
	entityB.y += body2_pct * overlap_y;

	// TODO delete this after figuring out where to use similar concepts
	// dot = directionX * result.overlap_y + directionY * -result.overlap_x;

	// body.directionX = 2 * dot * result.overlap_y - directionX;
	// body.directionY = 2 * dot * -result.overlap_x - directionY;

	// dot = body2.directionX * result.overlap_y + body2.directionY * -result.overlap_x;

	// body2.directionX = 2 * dot * result.overlap_y - body2.directionX;
	// body2.directionY = 2 * dot * -result.overlap_x - body2.directionY;
};

export const frag = (
	entity: Entity,
	collisions: Collisions,
	count: number,
	scaleVariance = 48,
): Entity[] => {
	const entities: Entity[] = [];
	// TODO get random list of scales distributing the area according to `scaleVariance`
	if (entity.body._circle) {
		const radii = toRandomRadii(Math.PI * entity.radius ** 2, count, scaleVariance);
		for (let i = 0; i < count; i++) {
			// get point around towards the center and draw a triangle
			const fragment = new Entity(
				collisions.createCircle(entity.x, entity.y, radii[i]) as EntityCircle,
			);
			fragment.speed = entity.speed;
			fragment.directionX = entity.directionX;
			fragment.directionY = entity.directionY;
			fragment.color = entity.color;
			entities.push(fragment);
		}
	} else {
		throw Error('TODO more types than circles');
	}
	return entities;
};

// TODO `scaleVariance` assumed to be >1
const toRandomRadii = (totalArea: number, count: number, scaleVariance: number): number[] => {
	const mults: number[] = [];
	for (let i = 0; i < count; i++) {
		mults[i] = 1 + random_float(0, 1) * (scaleVariance - 1);
	}
	const multsSum = mults.reduce((acc, m) => acc + m);
	const multPcts = mults.map((m) => m / multsSum);
	const areas = multPcts.map((m) => m * totalArea);
	const radii = areas.map((a) => Math.sqrt(a / Math.PI));
	return radii;
};
