import {randomFloat} from '@feltcoop/felt/util/random.js';
import type {Collisions, Body, Circle, Point, Polygon} from '$lib/collisions';

export interface Entity extends Body {
	speed: number;
	directionX: number;
	directionY: number;
	color: string;
	invisible?: boolean;
	dead?: boolean;
}

export interface EntityCircle extends Circle, Entity {
	_circle: true;
}
export interface EntityPoint extends Point, Entity {
	_point: true;
}
export interface EntityPolygon extends Polygon, Entity {
	_polygon: true;
}

export type EntityBody = EntityCircle | EntityPoint | EntityPolygon;

export const frag = (
	entity: EntityBody,
	collisions: Collisions,
	count: number,
	scaleVariance = 48,
): EntityBody[] => {
	const entities: EntityBody[] = [];
	// TODO get random list of scales distributing the area according to `scaleVariance`
	if (entity._circle) {
		const {radius} = entity as EntityCircle; // TODO why isn't the type constant working?
		const radii = toRandomRadii(Math.PI * radius ** 2, count, scaleVariance);
		for (let i = 0; i < count; i++) {
			// get point around towards the center and draw a triangle
			const fragment: EntityCircle = collisions.createCircle(entity.x, entity.y, radii[i]) as any;
			fragment.speed = entity.speed;
			fragment.directionX = entity.directionX;
			fragment.directionY = entity.directionY;
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
