import * as Pixi from '@pixi/core';
import {Application, type IApplicationOptions} from '@pixi/app';
import {Container} from '@pixi/display';
import {getContext, setContext, onMount, onDestroy} from 'svelte';

// TODO BLOCK 2 copies of this
export class PixiApp {
	app!: Application;
	default_scene!: Container;
	current_scene!: Container;

	init(options: IApplicationOptions): void {
		// Tell Pixi to use pixelated image scaling by default. BIG PX
		// Unfortunately this can cause choppy movement. We may want to revert this global default.
		// Here's how to change it back to the default for a resource:
		Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

		this.app = new Application(options);
		// this.app.ticker.add((dt) => {
		// 	console.log(`dt`, dt);
		// });

		const default_scene = new Container();
		(default_scene as any).interactiveChildren = false; // TODO this type error goes away with `esModuleInterop: true` in tsconfig, but that causes gross js output and it's not needed at runtime
		this.default_scene = this.current_scene = default_scene;
		this.app.stage.addChild(default_scene);
	}

	mount_scene(scene: Container): void {
		// these checks prevent mistakes, but we may want to change the behavior
		if (this.current_scene === scene) {
			throw Error(`Cannot mount scene that's already mounted. Unmount it first.`);
		}
		if (this.default_scene !== scene && this.current_scene !== this.default_scene) {
			throw Error(`Cannot replace a scene that is not the default. Reset it first.`);
		}
		this.app.stage.removeChild(this.current_scene);
		this.current_scene = scene;
		this.app.stage.addChild(scene);
	}

	unmount_scene(scene: Container): void {
		if (this.current_scene !== scene) {
			throw Error(`Cannot unmount scene because it's not currently mounted`);
		}
		this.mount_scene(this.default_scene);
	}

	// The loader API is troublesome because it errors with concurrent requests,
	// and we don't want to create multiple loaders or call `reset` for efficiency.
	// This helper is the first step to wrangling a better API without changing internals.
	wait_for_load(): Promise<void> {
		if (!this.app.loader.loading) {
			throw Error('Called `wait_for_load` when not loading.'); // maybe call `load` automatically instead?
		}
		return new Promise((r: () => void) => this.app.loader.onLoad.once(r));
	}
}

const PIXI_KEY = Symbol('pixi');
export const get_pixi = (): PixiApp => getContext(PIXI_KEY);
export const set_pixi = (pixi: PixiApp): PixiApp => setContext(PIXI_KEY, pixi);

export interface PixiSceneHooks {
	load?: (loader: Pixi.Loader) => void;
	loaded?: (
		scene: Container,
		resources: Partial<Record<string, Pixi.LoaderResource>>, // TODO Pixi.IResourceDictionary ? why is it partial?
		loader: Pixi.Loader,
	) => void;
	destroy?: (scene: Container | null, loader: Pixi.Loader) => void;
}

export const get_pixi_scene = (
	hooks: PixiSceneHooks,
	pixi: PixiApp = get_pixi(),
): [PixiApp, Container] => {
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
	const scene = new Container();
	(scene as any).interactiveChildren = false; // TODO this type error goes away with `esModuleInterop: true` in tsconfig, but that causes gross js output and it's not needed at runtime
	pixi.mount_scene(scene);

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
		pixi.unmount_scene(scene);
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
