import {randomFloat} from '@feltcoop/felt/util/random.js';
import type {Collisions, Body, Circle, Point, Polygon} from '@ryanatkn/collisions';

export interface Entity extends Body {
	speed: number;
	directionX: number;
	directionY: number;
	color: string;
	invisible?: boolean;
	dead?: boolean;
	text?: string;
	textOffsetX?: number;
	textOffsetY?: number;
	font?: string;
}

export type EntityCircle = Circle & Entity;
export type EntityPoint = Point & Entity;
export type EntityPolygon = Polygon & Entity;

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
		const radii = toRandomRadii(Math.PI * entity.radius ** 2, count, scaleVariance);
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
