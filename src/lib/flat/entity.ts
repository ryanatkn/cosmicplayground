import {
	type Collisions,
	type Body,
	type Circle,
	type Point,
	type Polygon,
} from '@ryanatkn/collisions';

export interface Entity extends Body {
	speed: number;
	directionX: number;
	directionY: number;
	color: string;
	invisible?: boolean;
	ghostly?: boolean;
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
	scaleVariance = 5,
): EntityBody[] => {
	const entities: EntityBody[] = [];
	// TODO get random list of scales distributing the area according to `scaleVariance`
	console.log(`frag entity`, entity);
	if (entity._circle) {
		const {radius} = entity as EntityCircle; // TODO why isn't the type constant working?
		const area = Math.PI * radius ** 2;
		for (let i = 0; i < count; i++) {
			console.log(`count`, count);
			// get point around towards the center and draw a triangle
			const fragment: EntityCircle = collisions.createCircle(
				entity.x,
				entity.y,
				Math.sqrt(area / count / Math.PI),
			) as any;
			fragment.speed = entity.speed;
			fragment.directionX = entity.directionX;
			fragment.directionY = entity.directionY;
			fragment.ghostly = entity.ghostly;
			fragment.color = entity.color;
			entities.push(fragment);
		}
	}
	return entities;
};
