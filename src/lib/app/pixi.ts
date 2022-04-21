import type PIXI from 'pixi.js';
import {getContext, setContext, onMount, onDestroy} from 'svelte';

// TODO initialized async because of this issue: https://github.com/sveltejs/kit/issues/1650
// TODO BLOCK looks like it's fixed: https://github.com/sveltejs/kit/pull/2804/files

export class PixiApp {
	PIXI!: typeof PIXI;
	app!: PIXI.Application;
	defaultScene!: PIXI.Container;
	currentScene!: PIXI.Container;

	init(pixiModule: typeof PIXI, options: PIXI.IApplicationOptions): void {
		this.PIXI = pixiModule;

		// Tell PIXI to use pixelated image scaling by default. BIG PX
		// Unfortunately this can cause choppy movement. We may want to revert this global default.
		// Here's how to change it back to the default for a resource:
		pixiModule.settings.SCALE_MODE = pixiModule.SCALE_MODES.NEAREST;

		this.app = new pixiModule.Application(options);

		const defaultScene = new pixiModule.Container();
		this.defaultScene = defaultScene;
		this.currentScene = defaultScene;
		this.app.stage.addChild(defaultScene);
	}

	mountScene(scene: PIXI.Container): void {
		// these checks prevent mistakes, but we may want to change the behavior
		if (this.currentScene === scene) {
			throw Error(`Cannot mount scene that's already mounted. Unmount it first.`);
		}
		if (this.defaultScene !== scene && this.currentScene !== this.defaultScene) {
			throw Error(`Cannot replace a scene that is not the default. Reset it first.`);
		}
		this.app.stage.removeChild(this.currentScene);
		this.currentScene = scene;
		this.app.stage.addChild(scene);
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
		if (!this.app.loader.loading) {
			throw Error('Called `waitForLoad` when not loading.'); // maybe call `load` automatically instead?
		}
		return new Promise((r: () => void) => this.app.loader.onLoad.once(r));
	}
}

export const pixiContextKey = {};
export const getPixi = (): PixiApp => getContext(pixiContextKey);
export const setPixi = (pixi: PixiApp): PixiApp => {
	setContext(pixiContextKey, pixi);
	return pixi;
};

export interface PixiSceneHooks {
	load?: (loader: PIXI.Loader) => void;
	loaded?: (
		scene: PIXI.Container,
		resources: Partial<Record<string, PIXI.LoaderResource>>, // TODO PIXI.IResourceDictionary ? why is it partial?
		loader: PIXI.Loader,
	) => void;
	destroy?: (scene: PIXI.Container | null, loader: PIXI.Loader) => void;
}

export const getPixiScene = (
	hooks: PixiSceneHooks,
	pixi: PixiApp = getPixi(),
): [PixiApp, PIXI.Container] => {
	// Mount the scene right away. When loading, we'll show a black background
	// and the scene component can display whatever it wants.
	const scene = new pixi.PIXI.Container();
	pixi.mountScene(scene);

	let destroyed = false; // TODO good for store state?

	// If we're already loading while creating a new scene,
	// cancel whatever's going on in the loader.
	// Otherwise, the loader throws error when the new scene calls `loader.add`.
	// We may want to provide an option to override this.
	// (or mabye a deeper fix with the loader is in order)
	if (pixi.app.loader.loading) {
		console.log('resetting loader! ack');
		pixi.app.loader.reset();
	}

	onMount(() => {
		hooks.load?.(pixi.app.loader);
		// TODO show progress? or expect title screen to make these gtg?
		pixi.app.loader.load((loader, resources) => {
			if (destroyed) return; // in case the scene is destroyed before loading finishes
			hooks.loaded?.(scene, resources, loader);
		});
	});

	onDestroy(() => {
		if (destroyed) throw Error('Already destroyed'); // TODO probably remove this
		console.log('destroying pixi scene', scene, pixi);
		hooks.destroy?.(scene, pixi.app.loader);
		destroyed = true;
		pixi.unmountScene(scene);
		// pixi.PIXI.utils.clearTextureCache(); // TODO see below
		scene.destroy({
			children: true,
			texture: false,
			baseTexture: false,
			// TODO I think we should do this, but does it cause bugs?
			// texture: true,
			// baseTexture: true,
		});
	});

	return [pixi, scene];
};
