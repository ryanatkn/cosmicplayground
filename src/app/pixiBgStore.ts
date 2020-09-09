import {writable, Writable} from 'svelte/store';
import * as PIXI from 'pixi.js';

export interface PixiBgState {
	sprite: PIXI.TilingSprite | null;
	url: string;
	width: number;
	height: number;
	x: number;
	y: number;
}

export interface PixiBgStore {
	subscribe: Writable<PixiBgState>['subscribe'];
	loadResources: () => void;
	updateDimensions: (width: number, height: number) => void;
	tick: (dt: number) => void;
}

const BG_DRIFT_SPEED = 0.01;

export const createPixiBgStore = (
	loader: PIXI.Loader,
	scene: PIXI.Container,
	url: string,
	width: number,
	height: number,
	x = 0,
	y = 0,
	alpha = 0.2,
	driftSpeed = BG_DRIFT_SPEED,
	scaleMode = PIXI.SCALE_MODES.LINEAR,
): PixiBgStore => {
	const {subscribe, update} = writable<PixiBgState>({sprite: null, url, width, height, x, y});

	const onLoad = (
		_loader: PIXI.Loader,
		resources: Partial<Record<string, PIXI.LoaderResource>>,
	) => {
		const {texture} = resources[url]!;
		texture.baseTexture.scaleMode = scaleMode;
		const sprite = new PIXI.TilingSprite(texture, width, height);
		sprite.alpha = alpha;
		scene.addChild(sprite);
		update((state) => ({...state, sprite}));
	};

	return {
		subscribe,
		loadResources: (): void => {
			loader.add(url).load(onLoad);
		},
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
