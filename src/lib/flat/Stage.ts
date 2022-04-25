import type {Flavored} from '@feltcoop/felt';
import {toRandomSeeded, type Alea} from '@feltcoop/felt/util/randomSeeded.js';
import * as Pixi from 'pixi.js';

import type {Simulation} from '$lib/flat/Simulation';
import {Controller} from '$lib/flat/Controller';
import type {Renderer} from '$lib/flat/renderer';
import {
	type CameraStore,
	type CameraState,
	toCameraStore,
	SPRING_OPTS_HARD,
} from '$lib/flat/camera';

export interface StageMeta {
	name: string;
	icon: string;
}

export type StageName = Flavored<string, 'StageName'>;

export interface StageSetupOptions {
	scene?: Pixi.Container;
	controller?: Controller;
	random?: Alea;
	// these are the initial dimensions that are updated via `resize`
	width: number;
	height: number;
	// TODO probably move this to the `camera`
	freezeCamera?: boolean;
}

// TODO rethink -- maybe events?
export type StageOutcome = {next_stage: StageName; unlock?: StageName[]};

export interface ExitStage {
	(outcome: StageOutcome | null): void;
}

export abstract class Stage {
	// TODO this couples Pixi to the stage, so we want to either factor it out
	// or change the concept of a `Renderer`,
	// and we want support for multiple renderers anyway,
	// so you can draw canvas over the Pixi for e.g. debugging collisions
	container: Pixi.Container;
	controller: Controller;
	random: Alea;

	time = 0;

	camera!: CameraStore;
	$camera!: CameraState;
	freezeCamera; // is the camera fixed in place?

	subscriptions: Array<() => void> = []; // TODO maybe use a component instead, for automatic lifecycle management? or otherwise refactor this

	constructor(options: StageSetupOptions) {
		const {
			width,
			height,
			scene = new Pixi.Container(),
			controller = new Controller(),
			random = toRandomSeeded(),
		} = options;

		this.container = scene;
		this.controller = controller;
		this.random = random;

		this.freezeCamera = options.freezeCamera ?? true;

		this.camera = toCameraStore({width, height, x: width / 2, y: height / 2});
		// TODO this is a hint this should be a Svelte component ...
		this.subscriptions.push(this.camera.subscribe(($camera) => (this.$camera = $camera)));
	}

	// TODO add some default impls
	destroy(): void {
		this.container.destroy({children: true, baseTexture: true, texture: true});
		// TODO refactor this out, maybe move everything to a component?
		for (const subscription of this.subscriptions) {
			subscription();
		}
	}

	abstract render(renderer: Renderer): void;
	abstract update(dt: number): void;

	/**
	 * Update the dimensions initialized in `setup`.
	 * @param width
	 * @param height
	 */
	resize(width: number, height: number): void {
		this.camera.setDimensions(width, height);
		if (this.freezeCamera) void this.camera.setPosition(width / 2, height / 2, SPRING_OPTS_HARD);
	}
}

export interface StageCreator {
	(sim: Simulation, controller: Controller, done: () => void): Stage;
}
