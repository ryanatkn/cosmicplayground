import type {Flavored, AsyncStatus} from '@feltcoop/felt';
import {toRandomSeeded, type Alea} from '@feltcoop/felt/util/randomSeeded.js';

import type {Simulation} from '$lib/flat/Simulation';
import type {Controller} from '$lib/flat/Controller';
import type {Renderer} from '$lib/flat/renderer';

export interface StageMeta {
	name: string;
	icon: string;
}

export type StageName = Flavored<string, 'StageName'>;

export interface StageSetupOptions {
	// these are the initial dimensions that are updated via `resize`
	width: number;
	height: number;
	// TODO probably shouldn't be generic for all stages, at least not the player ones
	freezeCamera: boolean;
}

// TODO rethink -- maybe events?
export type StageOutcome = {next_stage: StageName; unlock?: StageName[]};

export interface ExitStage {
	(outcome: StageOutcome | null): void;
}

export abstract class Stage {
	controller: Controller;
	time = 0;
	status: AsyncStatus = 'initial';
	random: Alea;

	// TODO options object instead of all these params
	constructor(controller: Controller, random: Alea = toRandomSeeded()) {
		this.controller = controller;
		this.random = random;
	}

	// TODO add some default impls
	abstract setup(options: StageSetupOptions): Promise<void>;
	abstract teardown(): Promise<void>; // TODO probably emit event at the end of this
	abstract render(renderer: Renderer): void;
	abstract resize(width: number, height: number): void; // update the dimensions initialized in `setup`

	update(dt: number): void {
		this.time += dt;
	}
}

export interface StageCreator {
	(sim: Simulation, controller: Controller, done: () => void): Stage;
}
