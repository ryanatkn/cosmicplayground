import * as PIXI from 'pixi.js';
import {getContext, setContext, onMount, onDestroy} from 'svelte';

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

export interface PixiSceneHooks {
	load: (loader: PIXI.Loader) => void;
	loaded: (
		scene: PIXI.Container,
		resources: Partial<Record<string, PIXI.LoaderResource>>, // TODO PIXI.IResourceDictionary ? why is it partial?
		loader: PIXI.Loader,
	) => void;
	destroy: (scene: PIXI.Container | null, loader: PIXI.Loader) => void;
}

// TODO do we want a return value? is this a custom store? or should we pass a function that gets callbacks to control it?
// we'll probably want to give more over what gets destroyed, but we'll do that when we have a usecase
// const pixiScene = usePixiScene(...?)
export const usePixiScene = (hooks: PixiSceneHooks, pixi = usePixi()): PixiApp => {
	let scene: PIXI.Container | null = null;
	let destroyed = false; // TODO good for store state?
	// TODO maybe add an `AsyncState` status for loading? return in store state?

	onMount(() => {
		hooks.load(pixi.loader);

		// TODO show progress? or expect title screen to make these gtg?
		pixi.loader.load((loader, resources) => {
			if (destroyed) return; // in case the scene is destroyed before loading finishes
			scene = new PIXI.Container();
			pixi.mountScene(scene);
			hooks.loaded(scene, resources, loader);
		});
	});

	onDestroy(() => {
		if (destroyed) throw Error('Already destroyed'); // TODO probably remove this
		hooks.destroy(scene, pixi.loader);
		destroyed = true;
		if (scene) {
			pixi.unmountScene(scene);
			scene.destroy({
				children: true,
				// TODO should we destroy the textures too?
				// I'm not sure of the best balance for UX and resource usage concerns.
				// Do we want it to be snappy if users navigate back to the page?
				// What if some textures are used in other areas of the app?
				// Do we want some custom heuristic, like nagivating away from this portal?
				texture: false,
				baseTexture: false,
			});
			scene = null;
		}
	});

	return pixi;
};
