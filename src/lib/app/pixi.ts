import {settings, SCALE_MODES} from '@pixi/core';
import {Application, type IApplicationOptions} from '@pixi/app';
import {Container} from '@pixi/display';
import {getContext, setContext, onMount, onDestroy} from 'svelte';

export class PixiApp {
	app!: Application;
	default_scene!: Container;
	current_scene!: Container;

	init(options?: Partial<IApplicationOptions>): void {
		// Tell Pixi to use pixelated image scaling by default. BIG PX
		// Unfortunately this can cause choppy movement. We may want to revert this global default.
		// Here's how to change it back to the default for a resource:
		settings.SCALE_MODE = SCALE_MODES.NEAREST;
		// BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

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
}

const PIXI_KEY = Symbol('pixi');
export const get_pixi = (): PixiApp => getContext(PIXI_KEY);
export const set_pixi = (pixi: PixiApp): PixiApp => setContext(PIXI_KEY, pixi);

export interface PixiSceneHooks {
	load?: (scene: Container) => Promise<void> | void;
	loaded?: (scene: Container) => Promise<void> | void;
	destroy?: (scene: Container | null) => void;
}

export const get_pixi_scene = (
	hooks: PixiSceneHooks,
	pixi: PixiApp = get_pixi(),
): {pixi: PixiApp; scene: Container} => {
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

	onMount(async () => {
		await hooks.load?.(scene);
		// TODO show progress? or expect title screen to make these gtg?
		if (destroyed) return; // in case the scene is destroyed before loading finishes
		await hooks.loaded?.(scene);
		// TODO disabled after upgrade - was used to avoid jank
		// pixi.app.renderer.plugins.prepare.upload(scene, () => ready());
	});

	onDestroy(() => {
		console.log('destroying pixi scene', scene, pixi);
		ready();
		hooks.destroy?.(scene);
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

	return {pixi, scene};
};
