import * as Pixi from '@pixi/core';
import {Container} from '@pixi/display';
import {getContext, setContext} from 'svelte';

// TODO BLOCK 2 copies of this
export class PixiApp {
	app!: Pixi.Application;
	defaultScene!: Container;
	currentScene!: Container;

	init(options: Pixi.IApplicationOptions): void {
		// Tell Pixi to use pixelated image scaling by default. BIG PX
		// Unfortunately this can cause choppy movement. We may want to revert this global default.
		Pixi.BaseTexture.defaultOptions.scaleMode = Pixi.SCALE_MODES.NEAREST;

		this.app = new Pixi.Application(options);
		// this.app.ticker.add((dt) => {
		// 	console.log(`dt`, dt);
		// });

		const defaultScene = new Container();
		(defaultScene as any).interactiveChildren = false; // TODO this type error goes away with `esModuleInterop: true` in tsconfig, but that causes gross js output and it's not needed at runtime
		this.defaultScene = this.currentScene = defaultScene;
		this.app.stage.addChild(defaultScene);
	}

	mountScene(scene: Container): void {
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

	unmountScene(scene: Container): void {
		if (this.currentScene !== scene) {
			throw Error(`Cannot unmount scene because it's not currently mounted`);
		}
		this.mountScene(this.defaultScene);
	}
}

export const pixiContextKey = {};
export const getPixi = (): PixiApp => getContext(pixiContextKey);
export const setPixi = (pixi: PixiApp): PixiApp => {
	setContext(pixiContextKey, pixi);
	return pixi;
};
