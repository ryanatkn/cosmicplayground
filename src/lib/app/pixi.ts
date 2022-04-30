import * as Pixi from 'pixi.js';
import {getContext, setContext, onMount, onDestroy} from 'svelte';

export class PixiApp {
	app!: Pixi.Application;
	defaultScene!: Pixi.Container;
	currentScene!: Pixi.Container;

	init(options: Pixi.IApplicationOptions): void {
		// Tell Pixi to use pixelated image scaling by default. BIG PX
		// Unfortunately this can cause choppy movement. We may want to revert this global default.
		// Here's how to change it back to the default for a resource:
		Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

		this.app = new Pixi.Application(options);
		// this.app.ticker.add((dt) => {
		// 	console.log(`dt`, dt);
		// });

		const defaultScene = new Pixi.Container();
		(defaultScene as any).interactiveChildren = false; // TODO this type error goes away with `esModuleInterop: true` in tsconfig, but that causes gross js output and it's not needed at runtime
		this.defaultScene = this.currentScene = defaultScene;
		this.app.stage.addChild(defaultScene);
	}

	mountScene(scene: Pixi.Container): void {
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

	unmountScene(scene: Pixi.Container): void {
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
	load?: (loader: Pixi.Loader) => void;
	loaded?: (
		scene: Pixi.Container,
		resources: Partial<Record<string, Pixi.LoaderResource>>, // TODO Pixi.IResourceDictionary ? why is it partial?
		loader: Pixi.Loader,
	) => void;
	destroy?: (scene: Pixi.Container | null, loader: Pixi.Loader) => void;
}

export const getPixiScene = (
	hooks: PixiSceneHooks,
	pixi: PixiApp = getPixi(),
): [PixiApp, Pixi.Container] => {
	let destroyed = false;

	// Disable the app, and use the `Pixi.Prepare` plugin
	// to re-enable it when ready to avoid jank:
	// https://pixijs.download/release/docs/PIXI.Prepare.html
	// This may be overly cautious but seems robust.
	const wasStarted = pixi.app.ticker.started;
	if (wasStarted) pixi.app.stop();
	const ready = () => {
		if (destroyed || !wasStarted) return;
		pixi.app.start();
	};

	// Mount the scene right away. When loading, we'll show a black background
	// and the scene component can display whatever it wants.
	const scene = new Pixi.Container();
	(scene as any).interactiveChildren = false; // TODO this type error goes away with `esModuleInterop: true` in tsconfig, but that causes gross js output and it's not needed at runtime
	pixi.mountScene(scene);

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
			// See `ready` above -- avoids jank.
			pixi.app.renderer.plugins.prepare.upload(scene, () => ready());
		});
	});

	onDestroy(() => {
		console.log('destroying pixi scene', scene, pixi);
		ready();
		hooks.destroy?.(scene, pixi.app.loader);
		destroyed = true;
		pixi.unmountScene(scene);
		// pixi.Pixi.utils.clearTextureCache(); // TODO see below
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
