import {Collisions} from '@ryanatkn/collisions';

import {Stage as BaseStage, type StageSetupOptions, type StageMeta} from '$lib/flat/stage';
import {type Entity, type EntityCircle, type EntityPolygon} from '$lib/flat/entity';
import {type Renderer} from '$lib/flat/renderer';
import {Simulation} from '$lib/flat/Simulation';
import {updateDirection} from '$lib/flat/Controller';
import {randomFloat} from '@feltcoop/felt/util/random.js';

// TODO use the CSS values (generate a CSS vars file?)
export const COLOR_DEFAULT = 'hsl(220, 100%, 70%)';
export const COLOR_PLAIN = 'hsl(220, 20%, 70%)';
export const COLOR_COLLIDING = 'hsl(340, 100%, 70%)';
export const COLOR_EXIT = 'hsl(140, 100%, 70%)';
export const COLOR_EXIT_INACTIVE = 'hsl(140, 30%, 30%)';
export const COLOR_GHOST = 'purple';
export const COLOR_PLAYER = 'violet';

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

	// these are instantiated in `setup`
	collisions!: Collisions;
	sim!: Simulation;
	player!: EntityCircle;
	// exits: Map<Entity, ExitEntity> = new Map(); // TODO consider this pattern when we need more stuff
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
			width / 2 + 100,
			height / 2 + 150,
			100,
		) as any);
		player.speed = 0.2;
		player.directionX = 0;
		player.directionY = 0;
		player.color = COLOR_PLAYER;
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

		// create the stuff
		// TODO create these programmatically from data
		const planet: EntityCircle = collisions.createCircle(
			250,
			100,
			player.radius * randomFloat(1.5, 2.5),
		) as any;
		planet.speed = 1;
		planet.directionX = 0;
		planet.directionY = 0;
		planet.ghostly = true;
		planet.color = COLOR_DEFAULT;
		bodies.push(planet);

		// TODO how will this work for polygons?
		const rockSize = player.radius * randomFloat(1.5, 2.5);
		const rock: EntityCircle = collisions.createCircle(
			width + rockSize / 2,
			height + rockSize / 2,
			rockSize,
		) as any;
		rock.speed = 0.01;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.ghostly = false;
		rock.color = COLOR_PLAIN;
		bodies.push(rock);

		const friend: EntityCircle = collisions.createCircle(
			400,
			600,
			player.radius * randomFloat(0.25, 0.5),
		) as any;
		friend.speed = 1;
		friend.directionX = 0;
		friend.directionY = 0;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
	}

	async teardown(): Promise<void> {
		// TODO
	}

	override update(dt: number): void {
		const {controller, player} = this;

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
