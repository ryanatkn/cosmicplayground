import type {Flavored} from '@grogarden/util/types.js';
import {create_random_alea, type Alea} from '@grogarden/util/random_alea.js';
import {Container} from '@pixi/display';
import {Graphics} from '@pixi/graphics';
import {Collisions} from '@ryanatkn/collisions';

import {Simulation} from '$lib/flat/Simulation';
import {Controller} from '$lib/flat/controller.js';
import {
	type CameraStore,
	type CameraState,
	toCameraStore,
	SPRING_OPTS_HARD,
} from '$lib/flat/camera';
import type {Entity} from '$lib/flat/entity.js';

// TODO hack
interface StageData {
	freezeCamera: boolean;
	playerSpeed: number; // TODO should this be `entities: [{name: 'player'}]`
	playerStrength: number; // TODO should this be `entities: [{name: 'player'}]`
	timeDilation: number;
	// worldWidth: number;
	// worldHeight: number;
	// TODO
	// entities: EntityData[];
}

export interface StageMeta {
	name: string;
	icon: string;
}

export type StageName = Flavored<string, 'StageName'>;

export interface StageOptions {
	exit: ExitStage;
	data?: Partial<StageData>;
	sim?: Simulation;
	collisions?: Collisions;
	container?: Container;
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

export interface StageSetupOptions {
	stageStates: StageState[];
}

export interface StageState {
	stage: Stage | null;
	StageConstructor: typeof Stage;
	// StageConstructor: {new (options: StageOptions): Stage};
	unlocked: boolean;
	completions: StageStats[];
}

export interface StageStats {
	time: number;
}

// TODO rethink - generic?
export type StageOutcome = {next_stage: StageName; unlock?: StageName[]};

export interface ExitStage {
	(outcome: StageOutcome | null): void;
}

export class Stage {
	static meta: StageMeta;

	exit: ExitStage;

	// TODO this couples Pixi to the stage, so we want to either factor it out
	// or change the concept of a `Renderer`,
	// and we want support for multiple renderers anyway,
	// so you can draw canvas over the Pixi for e.g. debugging collisions
	sim: Simulation;
	collisions: Collisions;
	container: Container;
	mask: Graphics | null = null;
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

	constructor(options: StageOptions) {
		const {
			exit,
			data,
			worldWidth,
			worldHeight,
			viewWidth,
			viewHeight,
			viewportWidth,
			viewportHeight,
			collisions = new Collisions(),
			sim = new Simulation(collisions),
			container = new Container(),
			controller = new Controller(),
			random = create_random_alea(),
		} = options;

		if (data) {
			if (data.freezeCamera !== undefined) this.freezeCamera = data.freezeCamera;
			if (data.timeDilation !== undefined) this.timeDilation = data.timeDilation;
			// TODO probably something like `entities: [{name: 'player', speed: 1.5, strength: 1.1}]`
			// playerSpeed: number;
			// playerStrength: number;
		}

		this.exit = exit;

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

	async setup(_options: StageSetupOptions): Promise<void> {
		// TODO probably emit event at the end of this
	}
	async teardown(): Promise<void> {
		// TODO probably emit event at the end of this
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
		this.camera.set_dimensions(worldWidth, worldHeight);
		// TODO this is hacky, doesn't seem to belong in `updateCameraPosition` for some reason
		if (this.freezeCamera) {
			void this.camera.setPosition(worldWidth / 2, worldHeight / 2, SPRING_OPTS_HARD);
		}
		this.updateCameraPosition();
		this.afterResize();
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

	afterResize(): void {
		// no-op hook - TODO redesign?
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
				this.mask = new Graphics();
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

	addEntity(entity: Entity): void {
		this.sim.addEntity(entity);
		this.container.addChild(entity.container);
		// TODO handle redrawing when graphics change, see `entity.draw`
		entity.draw();
	}

	removeEntity(entity: Entity): void {
		this.container.removeChild(entity.container);
		this.sim.removeEntity(entity);
		entity.destroy();
		// TODO remove from the other collections? maybe after figuring out the tagging/type/bitmask system
	}
}
