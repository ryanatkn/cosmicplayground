import * as PIXI from 'pixi.js';
import {getContext, setContext} from 'svelte';

if (typeof window !== 'undefined') window['PIXI'] = PIXI; // TODO dont do this, or at least handle SSR

// Tell PIXI to use pixelated image scaling by default. CHONKY pixels!!
// Unfortunately this can cause choppy movement. We may want to revert this global default.
// Here's how to change it back to the default for a resource:
// `resources.bg.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;`
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// TODO maybe don't extend the application?
export class PixiApp extends PIXI.Application {
	defaultScene: PIXI.Container;
	currentScene: PIXI.Container;

	constructor(options: PixiApplicationOptions) {
		super(options);
		const defaultScene = new PIXI.Container();
		this.defaultScene = defaultScene;
		this.currentScene = defaultScene;
		this.stage.addChild(defaultScene);
	}

	mountScene(scene: PIXI.Container): void {
		// these checks prevent mistakes, but we may want to change the behavior
		if (this.currentScene === scene) {
			throw Error(`Cannot mount scene that's already mounted. Unmount it first.`);
		}
		if (this.defaultScene !== scene && this.currentScene !== this.defaultScene) {
			throw Error(`Cannot replace a scene that is not the default. Reset it first.`);
		}
		this.stage.removeChild(this.currentScene);
		this.currentScene = scene;
		this.stage.addChild(scene);
	}

	unmountScene(scene: PIXI.Container): void {
		if (this.currentScene !== scene) {
			throw Error(`Cannot unmount scene because it's not currently mounted`);
		}
		this.mountScene(this.defaultScene);
	}
}

export const pixiContextKey = {};
export const usePixi = (): PixiApp => getContext(pixiContextKey);
export const providePixi = (pixi: PixiApp): PixiApp => {
	setContext(pixiContextKey, pixi);
	return pixi;
};

// Unfortunately it seems this type is inaccessible from PIXI itself.
interface PixiApplicationOptions {
	autoStart?: boolean;
	width?: number;
	height?: number;
	view?: HTMLCanvasElement;
	transparent?: boolean;
	autoDensity?: boolean;
	antialias?: boolean;
	preserveDrawingBuffer?: boolean;
	resolution?: number;
	forceCanvas?: boolean;
	backgroundColor?: number;
	clearBeforeRender?: boolean;
	powerPreference?: string;
	sharedTicker?: boolean;
	sharedLoader?: boolean;
	resizeTo?: Window | HTMLElement;
}
