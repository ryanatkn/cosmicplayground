import type {Flavored, AsyncStatus} from '@feltcoop/felt';
import {toRandomSeeded, type Alea} from '@feltcoop/felt/util/randomSeeded.js';

import type {Simulation} from '$lib/flat/Simulation';
import {Controller} from '$lib/flat/Controller';
import type {Renderer} from '$lib/flat/renderer';

export interface StageMeta {
	name: string;
	icon: string;
}

export type StageName = Flavored<string, 'StageName'>;

export interface StageSetupOptions {
	controller?: Controller;
	random?: Alea;
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

	constructor(options: StageSetupOptions) {
		this.controller = options.controller || new Controller();
		this.random = options.random || toRandomSeeded();
	}

	// TODO add some default impls
	abstract destroy(): void; // TODO emit event?
	abstract render(renderer: Renderer): void;
	abstract resize(width: number, height: number): void; // update the dimensions initialized in `setup`
	abstract update(dt: number): void;
}

export interface StageCreator {
	(sim: Simulation, controller: Controller, done: () => void): Stage;
}
