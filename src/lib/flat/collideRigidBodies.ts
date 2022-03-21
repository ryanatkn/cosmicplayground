// TODO name of this module/helper?

import type {CollisionResult} from '@ryanatkn/collisions';
import type {EntityBody} from '$lib/flat/entity';

export const collideRigidBodies = (
	bodyA: EntityBody,
	bodyB: EntityBody,
	result: CollisionResult,
): void => {
	const overlap_x = result.overlap! * result.overlap_x;
	const overlap_y = result.overlap! * result.overlap_y;
	const body2_pct = bodyB.speed / (bodyB.speed + bodyA.speed);
	const body1_pct = 1 - body2_pct;
	bodyA.x -= body1_pct * overlap_x;
	bodyA.y -= body1_pct * overlap_y;
	bodyB.x += body2_pct * overlap_x;
	bodyB.y += body2_pct * overlap_y;

	// TODO delete this after figuring out where to use similar concepts
	// dot = directionX * result.overlap_y + directionY * -result.overlap_x;

	// body.directionX = 2 * dot * result.overlap_y - directionX;
	// body.directionY = 2 * dot * -result.overlap_x - directionY;

	// dot = body2.directionX * result.overlap_y + body2.directionY * -result.overlap_x;

	// body2.directionX = 2 * dot * result.overlap_y - body2.directionX;
	// body2.directionY = 2 * dot * -result.overlap_x - body2.directionY;
};
