import {type Flavored} from '@feltcoop/felt';
import {toRandomSeeded, type Alea} from '@feltcoop/felt/util/randomSeeded.js';

import {type Simulation} from '$lib/flat/Simulation';
import {type Controller} from '$lib/flat/Controller';
import {type Renderer} from '$lib/flat/renderer';
import {type StageState} from '$lib/flat/stageState';

export interface StageConstructor {
	new (...args: ConstructorParameters<typeof Stage>): Stage;
	// TODO refactor this
	meta: StageMeta;
}

export interface StageMeta {
	name: string;
	icon: string;
}

export type StageName = Flavored<string, 'StageName'>;

export interface StageSetupOptions {
	stageStates: StageState[];
	seed: any; // TODO type?
	// these are the initial dimensions that are updated via `resize`
	width: number;
	height: number;
}

// TODO rethink -- maybe events?
export type StageOutcome = {next_stage: StageName; unlock?: StageName[]};

export interface ExitStage {
	(outcome: StageOutcome | null): void;
}

export abstract class Stage {
	static meta: StageMeta;

	meta: StageMeta;
	controller: Controller;
	exit: ExitStage;
	time = 0;
	random: Alea;
	hue: number;
	color: string;

	constructor(controller: Controller, exit: ExitStage, hue: number) {
		this.controller = controller;
		this.exit = exit;
		this.hue = hue;
		this.color = `hsl(${hue}, 100%, 77%)`;
		this.meta = (this.constructor as any).meta;
		this.random = toRandomSeeded();
	}

	// TODO add some default impls
	abstract setup(options: StageSetupOptions): Promise<void>;
	abstract teardown(): Promise<void>; // TODO probably emit event at the end of this
	abstract render(renderer: Renderer): void;
	abstract resize(width: number, height: number): void; // update the dimensions initialized in `setup`

	update(dt: number): void {
		this.time += dt;
		if (this.controller.pressing_exit) {
			this.exit(null);
		}
	}
}

export interface StageCreator {
	(sim: Simulation, controller: Controller, done: () => void): Stage;
}
