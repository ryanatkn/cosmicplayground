import * as Pixi from 'pixi.js';

import type {EntityBody} from '$lib/flat/entityBody';
import {hslToHex, hslToStr, type Hsl} from '$lib/util/colors';

const DEFAULT_COLOR: Hsl = [0.611, 1, 0.7];

/**
 * The `Entity` class wraps collision simulation and rendering into one object.
 * We may evolve towards and ECS design but this is fine for now.
 */
export class Entity<T extends EntityBody = EntityBody> {
	private _color!: Hsl;
	colorStr!: string;
	colorHex!: number;
	get color(): Hsl {
		return this._color;
	}
	set color(hsl: Hsl) {
		this._color = hsl;
		this.colorStr = hslToStr(...hsl);
		this.colorHex = hslToHex(...hsl);
	}

	// TODO `radius` with setter to both the container and body?

	text?: string;
	textOffsetX = 0;
	textOffsetY = 0;
	fontSize?: number;
	font?: string; // TODO BLOCK fontStr? user a setter like with `color`

	speed = 0;
	directionX = 0;
	directionY = 0;

	invisible = false;
	dead = false;
	// TODO removed the only usage of this,
	// but leaving it because it seems it'll be useful,
	// like "frozen in stasis", may need more system-disabling granularity tho
	disableSimulation = false;

	constructor(
		public readonly body: T,
		public readonly container: Pixi.Container = new Pixi.Container(),
	) {
		// TODO add an options object? or just do assignments after construction? more reusable to do options
		this.color = DEFAULT_COLOR;
		body.entity = this;
	}

	set x(x: number) {
		this.body.x = x;
		this.container.x = x;
	}

	set y(y: number) {
		this.body.y = y;
		this.container.y = y;
	}
}
