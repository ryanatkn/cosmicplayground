import {Collisions} from '@ryanatkn/collisions';
import {randomFloat} from '@feltcoop/felt/util/random.js';
import {dev} from '$app/env';

import {Stage as BaseStage, type StageSetupOptions, type StageMeta} from '$lib/flat/stage';
import {
	type Entity,
	type EntityBody,
	type EntityCircle,
	type EntityPolygon,
} from '$lib/flat/entity';
import {type Renderer} from '$lib/flat/renderer';
import {Simulation} from '$lib/flat/Simulation';
import {updateDirection} from '$lib/flat/Controller';

// TODO use the CSS values (generate a CSS vars file?)
export const COLOR_DEFAULT = 'hsl(220, 100%, 70%)';
export const COLOR_PLAIN = 'hsl(220, 20%, 70%)';
export const COLOR_COLLIDING = 'hsl(340, 100%, 70%)';
export const COLOR_EXIT = 'hsl(140, 100%, 70%)';
export const COLOR_EXIT_INACTIVE = 'hsl(140, 30%, 30%)';
export const COLOR_GHOST = 'purple';
export const COLOR_PLAYER = 'violet';
export const COLOR_MOLTEN = 'red';

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
	planet!: EntityCircle;
	rock!: EntityCircle;
	readonly friends: EntityCircle[] = [];
	readonly friendFragments: EntityBody[] = [];
	readonly planetFragments: EntityBody[] = [];
	readonly rockFragments: EntityBody[] = [];
	rockPassedFriends = false;
	rockPassedPlanet = false;

	// TODO not calling `setup` first is error-prone
	async setup({stageStates, width, height}: StageSetupOptions): Promise<void> {
		// TODO refactor
		if (this.ready) return;
		this.ready = true;

		const collisions = (this.collisions = new Collisions());
		const sim = (this.sim = new Simulation(collisions));
		const {controller, friends} = this;
		const {bodies} = sim;

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		const player: EntityCircle = (this.player = collisions.createCircle(
			width / 2 - 100,
			height / 2 - 150,
			100,
		) as any);
		player.speed = 0.2;
		player.directionX = 0;
		player.directionY = 0;
		player.color = COLOR_PLAYER;
		bodies.push(player);

		// create the bounds around the stage edges
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
		const planetRadius = 1618;
		const planet: EntityCircle = (this.planet = collisions.createCircle(
			-350 + planetRadius / 2 - width / 2,
			-1100 + planetRadius / 2 - height / 2,
			planetRadius,
		) as any);
		planet.speed = 1;
		planet.directionX = 0;
		planet.directionY = 0;
		planet.ghostly = true;
		planet.color = COLOR_DEFAULT;
		bodies.push(planet);

		// TODO how will this work for polygons?
		const rockSize = 262;
		const rock: EntityCircle = (this.rock = collisions.createCircle(
			width + rockSize / 2,
			height + rockSize / 2,
			rockSize,
		) as any);
		rock.speed = 0.07;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.ghostly = false;
		rock.color = COLOR_PLAIN;
		bodies.push(rock);

		let friend: EntityCircle = collisions.createCircle(
			width / 2 + 355,
			height / 2 + 420,
			33,
		) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(width / 2 + 545, height / 2 + 360, 33) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(width / 2 + 895, height / 2 + 220, 33) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(width / 2 + 795, height / 2 + 120, 33) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);
	}

	addBodies(bodies: EntityBody[]): void {
		this.sim.bodies.push(...bodies);
	}

	removeBody(body: EntityBody): void {
		this.sim.removeBody(body);
	}

	async teardown(): Promise<void> {
		// TODO
	}

	override update(dt: number): void {
		if (dev) dt *= 2;
		const {
			controller,
			player,
			planet,
			rock,
			friends,
			planetFragments,
			friendFragments,
			rockFragments,
		} = this;

		// TODO refactor this to use queries or tags or something

		super.update(dt);

		// gives stages full control over the sim `update`
		this.sim.update(dt);

		// TODO add a player controller component to handle this
		updateDirection(controller, player);

		for (const friend of friends) {
			if (!rock.dead && !friend.dead && rock.collides(friend)) {
				const newFriendFragments = this.frag(friend, this.collisions, 12);
				friendFragments.push(...newFriendFragments);
				// TODO helper? dead+remove+?
				friend.dead = true;
				this.removeBody(friend);
				for (const friendFragment of friendFragments) {
					friendFragment.speed = randomFloat(rock.speed / 2, rock.speed * 2);
					friendFragment.directionX = randomFloat(rock.directionX / 2, rock.directionX * 2);
					friendFragment.directionY = randomFloat(rock.directionY / 2, rock.directionY * 2);
					friendFragment.ghostly = false;
					friendFragment.color = COLOR_MOLTEN;
				}
				this.addBodies(newFriendFragments);
			}
		}

		if (!rock.dead && !planet.dead && rock.collides(planet)) {
			rock.dead = true;
			this.removeBody(rock);
			planet.dead = true;
			this.removeBody(planet);
			planetFragments.push(...this.frag(planet, this.collisions, 42));
			for (const planetFragment of planetFragments) {
				planetFragment.speed = rock.speed * 0.2 * randomFloat(0.5, 1.0);
				planetFragment.directionX = randomFloat(-rock.directionX / 2, rock.directionX / 2);
				planetFragment.directionY = randomFloat(-rock.directionY / 2, rock.directionY / 2);
				planetFragment.ghostly = false;
				planetFragment.color = COLOR_MOLTEN;
			}
			this.addBodies(planetFragments);
			rockFragments.push(...this.frag(this.rock, this.collisions, 210));
			for (const rockFragment of rockFragments) {
				rockFragment.speed = randomFloat(rock.speed / 2, rock.speed * 2);
				rockFragment.directionX = randomFloat(-rock.directionX * 2, rock.directionX * 0.25);
				rockFragment.directionY = randomFloat(-rock.directionY * 2, rock.directionY * 0.25);
				rockFragment.ghostly = false;
			}
			this.addBodies(rockFragments);
		}
		for (const friend of friends) {
			const collidingRockFragment = !friend.dead && rockFragments?.find((r) => r.collides(friend));
			if (collidingRockFragment) {
				// TODO refactor with the code above
				const newFriendFragments = this.frag(friend, this.collisions, 12);
				friendFragments.push(...newFriendFragments);
				// TODO helper? dead+remove+?
				friend.dead = true;
				this.removeBody(friend);
				for (const friendFragment of friendFragments) {
					friendFragment.speed = randomFloat(
						collidingRockFragment.speed / 8,
						collidingRockFragment.speed,
					);
					friendFragment.directionX = randomFloat(
						-collidingRockFragment.directionX / 2,
						collidingRockFragment.directionX,
					);
					friendFragment.directionY = randomFloat(
						-collidingRockFragment.directionY / 2,
						collidingRockFragment.directionY,
					);
					friendFragment.ghostly = false;
					friendFragment.color = COLOR_MOLTEN;
				}
				this.addBodies(newFriendFragments);
			}
		}

		for (const friendFragment of friendFragments) {
			if (friendFragment.dead) continue;
			// destroy friend fragments when they touch the planet, planet fragments, or rock fragments
			for (const planetFragment of planetFragments) {
				if (
					!friendFragment.dead &&
					!planetFragment.dead &&
					friendFragment.collides(planetFragment)
				) {
					// TODO helper? dead+remove+?
					friendFragment.dead = true;
					this.removeBody(friendFragment);
				}
			}
			if (!friendFragment.dead && !planet.dead && friendFragment.collides(planet)) {
				// TODO helper? dead+remove+?
				friendFragment.dead = true;
				this.removeBody(friendFragment);
			}
			for (const rockFragment of rockFragments) {
				if (!friendFragment.dead && !rockFragment.dead && friendFragment.collides(rockFragment)) {
					// TODO helper? dead+remove+?
					friendFragment.dead = true;
					this.removeBody(friendFragment);
				}
			}
		}

		if (
			!this.rockPassedFriends &&
			friends.every((friend) => !friend.dead && rock.x + rock.radius < friend.x - friend.radius)
		) {
			this.rockPassedFriends = true;
		}
		if (!this.rockPassedPlanet && !planet.dead && rock.x + rock.radius < planet.x - planet.radius) {
			this.rockPassedPlanet = true;
		}

		// TODO see `disasterAverted`
		// if (this.rockPassedFriends && this.rockPassedPlanet) {
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