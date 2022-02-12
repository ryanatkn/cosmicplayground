import {Collisions} from '@ryanatkn/collisions';

import {Stage as BaseStage, type StageSetupOptions, type StageMeta} from '$lib/flat/stage';
import {type Entity, type EntityCircle, type EntityPolygon} from '$lib/flat/entity';
import {type Renderer} from '$lib/flat/renderer';
import {Simulation} from '$lib/flat/Simulation';
import {updateDirection} from '$lib/flat/Controller';

export const COLOR_DEFAULT = 'hsl(220, 100%, 70%)';
export const COLOR_COLLIDING = 'hsl(340, 100%, 70%)';
export const COLOR_EXIT = 'hsl(140, 100%, 70%)';
export const COLOR_EXIT_INACTIVE = 'hsl(140, 30%, 30%)';
export const COLOR_GHOST = 'purple';

// TODO rewrite this to use a route Svelte component? `dealt.dev/tar/home`

// TODO what if this file were named `home.stage.ts` instead of `0__home.ts` ?

const result = Collisions.createResult(); // TODO

const meta: StageMeta = {
	name: 'saucer',
	icon: '🥚',
};

interface ExitEntity {
	stage_name: string;
	entity: Entity;
}

export class Stage extends BaseStage {
	static override meta = meta;

	ready = false;
	finished = false; // stops when the conditions are met and the player collides with the exit

	player_radius = 5;

	// these are instantiated in `setup`
	collisions!: Collisions;
	sim!: Simulation;
	player!: EntityCircle;
	exits: Map<Entity, ExitEntity> = new Map();
	bounds!: EntityPolygon;

	// TODO not calling `setup` first is error-prone
	async setup({stageStates, width, height}: StageSetupOptions): Promise<void> {
		// TODO refactor
		if (this.ready) return;
		this.ready = true;

		const collisions = (this.collisions = new Collisions()); // eslint-disable-line no-multi-assign
		const sim = (this.sim = new Simulation(collisions)); // eslint-disable-line no-multi-assign
		const {controller} = this;
		const {bodies} = sim;

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		// eslint-disable-next-line no-multi-assign
		const player: EntityCircle = (this.player = collisions.createCircle(
			100,
			147,
			this.player_radius,
		) as any);
		player.speed = 0.2;
		player.direction_x = 0;
		player.direction_y = 0;
		bodies.push(player);

		// create the bounds around the stage edges
		// eslint-disable-next-line no-multi-assign
		const bounds: EntityPolygon = (this.bounds = collisions.createPolygon(0, 0, [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
		]) as any);
		bounds.invisible = true;
		bounds.ghostly = true;
		bounds.scale_x = width;
		bounds.scale_y = height;
		bodies.push(bounds);

		// create the stages
		// TODO create these programmatically from data
		const exit_stage_1: EntityCircle = collisions.createCircle(200, 100, player.radius * 4) as any;
		exit_stage_1.speed = 1;
		exit_stage_1.direction_x = 0;
		exit_stage_1.direction_y = 0;
		exit_stage_1.ghostly = true;
		exit_stage_1.color = COLOR_EXIT;
		bodies.push(exit_stage_1);
		this.exits.set(exit_stage_1, {stage_name: '1__gate', entity: exit_stage_1});

		const unlocked_stage_2 = stageStates.some(
			(s) => s.stageConstructor.meta.name === '2__paths' && s.unlocked,
		);
		const exit_stage_2: EntityCircle = collisions.createCircle(200, 200, player.radius * 4) as any;
		exit_stage_2.speed = 1;
		exit_stage_2.direction_x = 0;
		exit_stage_2.direction_y = 0;
		exit_stage_2.ghostly = unlocked_stage_2;
		exit_stage_2.color = unlocked_stage_2 ? COLOR_EXIT : COLOR_EXIT_INACTIVE;
		bodies.push(exit_stage_2);
		this.exits.set(exit_stage_2, {stage_name: '2__paths', entity: exit_stage_2});

		const unlocked_stage_3 = stageStates.some(
			(s) => s.stageConstructor.meta.name === '3__win' && s.unlocked,
		);
		const exit_stage_3: EntityCircle = collisions.createCircle(147, 247, player.radius * 4) as any;
		exit_stage_3.speed = 1;
		exit_stage_3.direction_x = 0;
		exit_stage_3.direction_y = 0;
		exit_stage_3.ghostly = unlocked_stage_3;
		exit_stage_3.color = unlocked_stage_3 ? COLOR_EXIT : COLOR_EXIT_INACTIVE;
		bodies.push(exit_stage_3);
		this.exits.set(exit_stage_3, {stage_name: '3__win', entity: exit_stage_3});
	}

	async teardown(): Promise<void> {
		// TODO
	}

	override update(dt: number): void {
		const {controller, player, exits} = this;

		super.update(dt);

		// gives stages full control over the sim `update`
		this.sim.update(dt);

		// TODO add a player controller component to handle this
		updateDirection(controller, player);

		// for (const exit of exits.values()) {
		// 	if (exit.entity.color === COLOR_EXIT && exit.entity.collides(this.player, result)) {
		// 		this.exit({next_stage: exit.stage_name});
		// 		break;
		// 	}
		// }

		// if (!this.bounds.collides(this.player, result)) {
		// 	this.exit({next_stage: meta.name});
		// }
	}

	render(renderer: Renderer): void {
		renderer.clear();
		renderer.render(this.sim.bodies);
	}

	resize(width: number, height: number): void {
		this.bounds.scale_x = width;
		this.bounds.scale_y = height;
	}
}
