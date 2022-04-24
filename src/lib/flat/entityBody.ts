import type {Body, Circle, Point, Polygon} from '@ryanatkn/collisions';

export interface IEntityBody extends Body {
	// TODO BLOCK move this stuff out of the body onto the entity,
	// (and change the simulation so it uses the entity, not the body?)
	speed: number;
	directionX: number;
	directionY: number;
	invisible?: boolean;
	dead?: boolean;
	disableSimulation?: boolean;
	text?: string;
	textOffsetX?: number;
	textOffsetY?: number;
	fontSize?: number;
	font?: string;
}

export type EntityCircle = Circle & IEntityBody;
export type EntityPoint = Point & IEntityBody;
export type EntityPolygon = Polygon & IEntityBody;

export type EntityBody = EntityCircle | EntityPoint | EntityPolygon;
