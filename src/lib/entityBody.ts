import type {Body, Circle, Point, Polygon} from '@ryanatkn/collisions';

import type {Entity} from '$lib/entity.js';

export interface IEntityBody extends Body {
	entity: Entity;
}

export type EntityCircle = Circle & IEntityBody;
export type EntityPoint = Point & IEntityBody;
export type EntityPolygon = Polygon & IEntityBody;

export type EntityBody = EntityCircle | EntityPoint | EntityPolygon;
