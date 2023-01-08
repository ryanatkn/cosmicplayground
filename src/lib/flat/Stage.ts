import type {Flavored} from '@feltcoop/util';
import {toRandomAlea, type Alea} from '@feltcoop/util/random-alea.js';
import * as Pixi from 'pixi.js';
import {Collisions} from '@ryanatkn/collisions';

import {Simulation} from '$lib/flat/Simulation';
import {Controller} from '$lib/flat/Controller';
import {
	type CameraStore,
	type CameraState,
	toCameraStore,
	SPRING_OPTS_HARD,
} from '$lib/flat/camera';
import type {StageData} from '../../routes/gravity-unlock/stage'; // TODO generic, don't import

export interface StageMeta {
	name: string;
	icon: string;
}

export type StageName = Flavored<string, 'StageName'>;

export interface StageSetupOptions {
	data?: Partial<StageData>;
	sim?: Simulation;
	collisions?: Collisions;
	container?: Pixi.Container;
	controller?: Controller;
	random?: Alea;
	// these are the initial dimensions that are updated via `resize`
	worldWidth: number;
	worldHeight: number;
	viewWidth: number;
	viewHeight: number;
	viewportWidth: number;
	viewportHeight: number;
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
	sim: Simulation;
	collisions: Collisions;
	container: Pixi.Container;
	mask: Pixi.Graphics | null = null;
	controller: Controller;
	random: Alea;

	time = 0;
	timeDilation = 1;

	worldWidth: number;
	worldHeight: number;
	viewWidth: number;
	viewHeight: number;
	viewportWidth: number;
	viewportHeight: number;

	camera!: CameraStore;
	$camera!: CameraState;
	freezeCamera = false; // is the camera fixed in place?

	subscriptions: Array<() => void> = []; // TODO maybe use a component instead, for automatic lifecycle management? or otherwise refactor this

	constructor(options: StageSetupOptions) {
		const {
			data,
			worldWidth,
			worldHeight,
			viewWidth,
			viewHeight,
			viewportWidth,
			viewportHeight,
			collisions = new Collisions(),
			sim = new Simulation(collisions),
			container = new Pixi.Container(),
			controller = new Controller(),
			random = toRandomAlea(),
		} = options;

		if (data) {
			if (data.freezeCamera !== undefined) this.freezeCamera = data.freezeCamera;
			if (data.timeDilation !== undefined) this.timeDilation = data.timeDilation;
			// TODO probably something like `entities: [{name: 'player', speed: 1.5, strength: 1.1}]`
			// playerSpeed: number;
			// playerStrength: number;
		}

		this.sim = sim;
		this.collisions = collisions;
		this.container = container;
		this.controller = controller;
		this.random = random;

		this.worldWidth = worldWidth;
		this.worldHeight = worldHeight;
		this.viewWidth = viewWidth;
		this.viewHeight = viewHeight;
		this.viewportWidth = viewportWidth;
		this.viewportHeight = viewportHeight;

		this.camera = toCameraStore({
			width: worldWidth,
			height: worldHeight,
			x: worldWidth / 2,
			y: worldHeight / 2,
		});
		// TODO this is a hint this should be a Svelte component ... see also the cleanup below
		this.subscriptions.push(this.camera.subscribe(($camera) => (this.$camera = $camera)));
	}

	destroy(): void {
		this.container.destroy({children: true, baseTexture: true, texture: true});
		// TODO refactor this out, maybe move everything to a component? see also the usage above
		for (const subscription of this.subscriptions) {
			subscription();
		}
	}

	/**
	 * Updates the stage's simulation by a `dt` amount of time.
	 * @param dt The time delta in milliseconds after `timeDilation` is applied, if the implementing stage wants.
	 */
	update(dt: number): void {
		// TODO time dilation controls
		this.time += dt; // TODO maybe don't track this on the stage? clock?
		this.updateCameraPosition();
	}

	toData(): StageData {
		return {
			freezeCamera: this.freezeCamera,
			playerSpeed: (this as any).player.speed, // TODO should be generic per entity, entities tagged with 'player_controller'
			playerStrength: (this as any).player.strength, // TODO should be generic per entity, entities tagged with 'player_controller'
			timeDilation: this.timeDilation,
		};
	}

	/**
	 * Update the dimensions initialized in `setup`.
	 * @param worldWidth
	 * @param worldHeight
	 * @param viewWidth
	 * @param viewHeight
	 * @param viewportWidth
	 * @param viewportHeight
	 */
	resize(
		worldWidth: number,
		worldHeight: number,
		viewWidth: number,
		viewHeight: number,
		viewportWidth: number,
		viewportHeight: number,
	): void {
		this.worldWidth = worldWidth;
		this.worldHeight = worldHeight;
		this.viewWidth = viewWidth;
		this.viewHeight = viewHeight;
		this.viewportWidth = viewportWidth;
		this.viewportHeight = viewportHeight;
		this.drawMask();
		this.camera.setDimensions(worldWidth, worldHeight);
		// TODO this is hacky, doesn't seem to belong in `updateCameraPosition` for some reason
		if (this.freezeCamera) {
			void this.camera.setPosition(worldWidth / 2, worldHeight / 2, SPRING_OPTS_HARD);
		}
		this.updateCameraPosition();
	}

	updateCameraPosition(): void {
		const {container, viewWidth, viewHeight, $camera} = this;
		const scale = Math.min(viewWidth / this.worldWidth, viewHeight / this.worldHeight);
		container.scale.set(scale);
		container.position.set(
			(-$camera.x + $camera.width / 2) * scale + (this.viewportWidth - viewWidth) / 2,
			(-$camera.y + $camera.height / 2) * scale + (this.viewportHeight - viewHeight) / 2,
		);
	}

	/**
	 * The mask constraints the visible content to an arbitrary view subset of the viewport.
	 * If the view and viewport are equal, no mask is created.
	 */
	private drawMask(): void {
		const maskX = (this.viewportWidth - this.viewWidth) / 2;
		const maskY = (this.viewportHeight - this.viewHeight) / 2;
		if (maskX === 0 && maskY === 0) {
			if (this.mask) {
				this.container.mask = null;
				this.mask.parent.removeChild(this.mask);
				this.mask.destroy({baseTexture: true, texture: true});
				this.mask = null;
			}
		} else {
			if (!this.mask) {
				this.mask = new Pixi.Graphics();
				this.container.mask = this.mask;
				this.container.addChild(this.mask);
			} else {
				this.mask.clear();
			}
			this.mask.beginFill(0x000000);
			this.mask.drawRect(0, 0, this.worldWidth, this.worldHeight);
			this.mask.endFill();
		}
	}
}

export interface StageCreator {
	(sim: Simulation, controller: Controller, done: () => void): Stage;
}
