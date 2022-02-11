import {type Body, type Circle, type Point, type Polygon} from '@ryanatkn/collisions';

export interface Entity extends Body {
	speed: number;
	direction_x: number;
	direction_y: number;
	color: string;
	invisible?: boolean;
	ghostly?: boolean;
}

export interface EntityCircle extends Circle, Entity {}
export interface EntityPoint extends Point, Entity {}
export interface EntityPolygon extends Polygon, Entity {}

export type EntityBody = EntityCircle | EntityPoint | EntityPolygon;
