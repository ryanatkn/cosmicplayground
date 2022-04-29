import * as Pixi from 'pixi.js';

import type {EntityBody} from '$lib/flat/entityBody';
import {hslToHex, hslToStr, type Hsl} from '$lib/util/colors';

const DEFAULT_COLOR: Hsl = [0.611, 1, 0.7];
const DEFAULT_COLOR_STR = hslToStr(...DEFAULT_COLOR);
const DEFAULT_COLOR_HEX = hslToHex(...DEFAULT_COLOR);

// TODO probably want increments of ~3px for line width in the design language,
// and connect it to an `Entity` property like
// `toughness` or `armor` or `shielding` or `shieldStrength` or something
const ENTITY_LINE_WIDTH = 3;

export const DEFAULT_STRENGTH = 1;

/**
 * The `Entity` class wraps collision simulation and rendering into one object.
 * We may evolve towards and ECS design but this is fine for now.
 */
export class Entity<T extends EntityBody = EntityBody> {
	speed = 0;
	strength = DEFAULT_STRENGTH;
	directionX = 0;
	directionY = 0;

	radius: number; // TODO support polygons/etc, types might be tricky, might need to extend base entity class (later, we'll probably refactor to an ECS)

	_invisible = false;
	get invisible(): boolean {
		return this._invisible;
	}
	set invisible(invisible: boolean) {
		this._invisible = invisible;
		this.container.visible = !invisible;
	}
	dead = false;
	// TODO removed the only usage of this,
	// but leaving it because it seems it'll be useful,
	// like "frozen in stasis", may need more system-disabling granularity tho
	disableSimulation = false;

	private _color: Hsl = DEFAULT_COLOR;
	colorStr = DEFAULT_COLOR_STR;
	colorHex = DEFAULT_COLOR_HEX;
	get color(): Hsl {
		return this._color;
	}
	set color(hsl: Hsl) {
		this._color = hsl;
		this.colorStr = hslToStr(...hsl);
		this.colorHex = hslToHex(...hsl);
	}

	// TODO `radius` with setter to both the container and body?

	text: string | null = null;
	textOffsetX = 0;
	textOffsetY = 0;
	_fontFamily = 'Arial';
	_fontSize = 26;
	_font = '26px Arial';
	get fontSize(): number {
		return this._fontSize;
	}
	set fontSize(fontSize: number) {
		this._fontSize = fontSize;
		this._font = `${fontSize}px ${this._fontFamily}`;
	}
	get fontFamily(): string {
		return this._fontFamily;
	}
	set fontFamily(fontFamily: string) {
		this._fontFamily = fontFamily;
		this._font = `${this._fontSize}px ${fontFamily}`;
	}
	get font(): string {
		return this._font;
	}

	constructor(
		public readonly body: T,
		public readonly container: Pixi.Container = new Pixi.Container(),
	) {
		// TODO add an options object? or just do assignments after construction? more reusable to do options
		body.entity = this;
		// The `body` has the initial source of truth for the position and dimensions,
		// but then the entity takes over responsibility with setters.
		this.x = body.x;
		this.y = body.y;
		if (body._circle) {
			this.radius = body.radius;
		} else {
			throw Error('TODO support more than circles');
		}
	}

	// TODO this doesn't handle entities composed inside of other entities
	// because the `body` coordinates are global and the `container`'s are local to the parent
	_x!: number;
	_y!: number;
	get x(): number {
		return this._x;
	}
	set x(x: number) {
		this._x = x;
		this.body.x = x;
		this.container.x = x;
	}
	get y(): number {
		return this._y;
	}
	set y(y: number) {
		this._y = y;
		this.body.y = y;
		this.container.y = y;
	}

	drawn = false;
	draw(): void {
		// TODO remove this hack to handle updating an entity's graphics
		if (this.drawn) throw Error('TODO allow drawing an entity more than once');
		this.drawn = true;

		if (this.body._circle) {
			const graphics = new Pixi.Graphics();
			this.container.addChild(graphics);
			graphics.lineStyle(ENTITY_LINE_WIDTH, this.colorHex);
			graphics.beginFill(0, 0);
			graphics.drawCircle(0, 0, this.radius);
			graphics.endFill();
		} else {
			throw Error('TODO support more than circles');
		}

		if (this.text) {
			const text = new Pixi.Text(this.text, {fontSize: this.fontSize, fontFamily: this.fontFamily});
			if (this.textOffsetX || this.textOffsetY) {
				text.position.set(this.textOffsetX, this.textOffsetY);
			}
			this.container.addChild(text);
			text.anchor.set(0.5, 0.5);
		}
	}

	destroy(): void {
		this.dead = true;
		this.container.destroy({children: true, texture: true, baseTexture: true});
	}
}
