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

	// The loader API is troublesome because it errors with concurrent requests,
	// and we don't want to create multiple loaders or call `reset` for efficiency.
	// This helper is the first step to wrangling a better API without changing internals.
	waitForLoad(): Promise<void> {
		if (!this.loader.loading) {
			throw Error('Called `waitForLoad` when not loading.'); // maybe call `load` automatically instead?
		}
		return new Promise((r) => this.loader.onLoad.once(r));
	}
}

export const pixiContextKey = {};
export const get_pixi = (): PixiApp => getContext(pixiContextKey);
export const set_pixi = (pixi: PixiApp): PixiApp => {
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
	load?: (loader: PIXI.Loader) => void;
	loaded?: (
		scene: PIXI.Container,
		resources: Partial<Record<string, PIXI.LoaderResource>>, // TODO PIXI.IResourceDictionary ? why is it partial?
		loader: PIXI.Loader,
	) => void;
	destroy?: (scene: PIXI.Container | null, loader: PIXI.Loader) => void;
}

export const get_pixi_scene = (
	hooks: PixiSceneHooks,
	pixi = get_pixi(),
): [PixiApp, PIXI.Container] => {
	// Mount the scene right away. When loading, we'll show a black background
	// and the scene component can display whatever it wants.
	const scene = new PIXI.Container();
	pixi.mountScene(scene);

	let destroyed = false; // TODO good for store state?

	// If we're already loading while creating a new scene,
	// cancel whatever's going on in the loader.
	// Otherwise, the loader throws error when the new scene calls `loader.add`.
	// We may want to provide an option to override this.
	// (or mabye a deeper fix with the loader is in order)
	if (pixi.loader.loading) {
		console.log('resetting loader! ack');
		pixi.loader.reset();
	}

	onMount(() => {
		hooks.load && hooks.load(pixi.loader);
		// TODO show progress? or expect title screen to make these gtg?
		pixi.loader.load((loader, resources) => {
			if (destroyed) return; // in case the scene is destroyed before loading finishes
			hooks.loaded && hooks.loaded(scene, resources, loader);
		});
	});

	onDestroy(() => {
		if (destroyed) throw Error('Already destroyed'); // TODO probably remove this
		hooks.destroy && hooks.destroy(scene, pixi.loader);
		destroyed = true;
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
	});

	return [pixi, scene];
};
