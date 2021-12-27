import {writable} from 'svelte/store';
import type {Writable} from 'svelte/store';
import * as PIXI from 'pixi.js';

export interface PixiBgState {
	sprite: PIXI.TilingSprite | null;
	width: number;
	height: number;
	x: number;
	y: number;
}

export interface PixiBgStore {
	subscribe: Writable<PixiBgState>['subscribe'];
	updateDimensions: (width: number, height: number) => void;
	tick: (dt: number) => void;
}

const BG_DRIFT_SPEED = 0.0033;

export const createPixiBgStore = (
	texture: PIXI.Texture,
	width: number,
	height: number,
	x = 0,
	y = 0,
	alpha = 0.2,
	driftSpeed = BG_DRIFT_SPEED,
): PixiBgStore => {
	texture.baseTexture.setStyle(PIXI.SCALE_MODES.LINEAR); // make it scroll smoothly
	const sprite = new PIXI.TilingSprite(texture, width, height);
	sprite.alpha = alpha;

	const {subscribe, update} = writable<PixiBgState>({sprite, width, height, x, y});

	return {
		subscribe,
		updateDimensions: (width: number, height: number): void => {
			update((state) => {
				const {sprite} = state;
				if (!sprite || (state.width === width && state.height === height)) {
					return state;
				}
				sprite.width = width;
				sprite.height = height;
				return {...state, width, height}; // sprite is mutated above
			});
		},
		tick: (dt: number): void => {
			update((state) => {
				const {sprite} = state;
				if (!sprite || !dt) return state;
				const x = sprite.tilePosition.x + dt * driftSpeed;
				const y = sprite.tilePosition.y + dt * (driftSpeed / 2);
				sprite.tilePosition.x = x;
				sprite.tilePosition.y = y;
				return {...state, x, y}; // sprite is mutated above
			});
		},
	};
};
