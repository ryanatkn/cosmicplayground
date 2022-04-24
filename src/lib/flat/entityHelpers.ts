import {randomFloat} from '@feltcoop/felt/util/random.js';
import type {Collisions} from '@ryanatkn/collisions';

import {Entity} from '$lib/flat/Entity';
import type {EntityCircle} from './entityBody';

export const frag = (
	entity: Entity,
	collisions: Collisions,
	count: number,
	scaleVariance = 48,
): Entity[] => {
	const entities: Entity[] = [];
	const {body} = entity;
	// TODO get random list of scales distributing the area according to `scaleVariance`
	if (body._circle) {
		const radii = toRandomRadii(Math.PI * body.radius ** 2, count, scaleVariance);
		for (let i = 0; i < count; i++) {
			// get point around towards the center and draw a triangle
			const fragment = new Entity(
				collisions.createCircle(entity.x, entity.y, radii[i]) as EntityCircle,
			);
			fragment.body.speed = body.speed;
			fragment.body.directionX = body.directionX;
			fragment.body.directionY = body.directionY;
			fragment.color = entity.color;
			entities.push(fragment);
		}
	}
	return entities;
};

// TODO `scaleVariance` assumed to be >1
const toRandomRadii = (totalArea: number, count: number, scaleVariance: number): number[] => {
	const mults: number[] = [];
	for (let i = 0; i < count; i++) {
		mults[i] = 1 + randomFloat(0, 1) * (scaleVariance - 1);
	}
	const multsSum = mults.reduce((acc, m) => acc + m);
	const multPcts = mults.map((m) => m / multsSum);
	const areas = multPcts.map((m) => m * totalArea);
	const radii = areas.map((a) => Math.sqrt(a / Math.PI));
	return radii;
};
