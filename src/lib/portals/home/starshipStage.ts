import {Collisions} from '@ryanatkn/collisions';
import {randomFloat} from '@feltcoop/felt/util/random.js';

import {Stage as BaseStage, type StageSetupOptions, type StageMeta} from '$lib/flat/stage';
import type {
	// type Entity,
	EntityBody,
	EntityCircle,
	EntityPolygon,
} from '$lib/flat/entity';
import type {Renderer} from '$lib/flat/renderer';
import {Simulation} from '$lib/flat/Simulation';
import {updateDirection} from '$lib/flat/Controller';
import {type CameraStore, toCameraStore, type CameraState} from '$lib/flat/camera';

// TODO use the CSS values (generate a CSS vars file?)
export const COLOR_DEFAULT = 'hsl(220, 100%, 70%)';
export const COLOR_PLAIN = 'hsl(220, 20%, 70%)';
export const COLOR_COLLIDING = 'hsl(340, 100%, 70%)';
export const COLOR_EXIT = 'hsl(140, 100%, 70%)';
export const COLOR_EXIT_INACTIVE = 'hsl(140, 30%, 30%)';
export const COLOR_GHOST = 'purple';
export const COLOR_PLAYER = 'violet';
export const COLOR_MOLTEN = 'red';

export const PLAYER_SPEED = 0.2;
export const PLAYER_SPEED_BOOSTED = PLAYER_SPEED * 1.618;

// TODO rewrite this to use a route Svelte component? `dealt.dev/tar/home`

// TODO what if this file were named `home.stage.ts` instead of `0__home.ts` ?

// const result = Collisions.createResult(); // TODO

const meta: StageMeta = {
	name: 'saucer',
	icon: '🥚',
};

// interface ExitEntity {
// 	stage_name: string;
// 	entity: Entity;
// }

export interface StarshipStageScores {
	friends: boolean[];
	planet: boolean;
}
export const rescuedAnyCrew = (scores: StarshipStageScores): boolean =>
	scores.planet || scores.friends.some(Boolean);
export const rescuedAllFriends = (scores: StarshipStageScores): boolean =>
	scores.friends.every(Boolean);
export const rescuedAllCrew = (scores: StarshipStageScores): boolean =>
	scores.planet && rescuedAllFriends(scores);

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

	camera!: CameraStore;
	$camera!: CameraState;
	freezeCamera = true;

	subscriptions: Array<() => void> = []; // TODO maybe use a component instead, for automatic lifecycle management?

	// TODO not calling `setup` first is error-prone
	async setup({width, height}: StageSetupOptions): Promise<void> {
		// TODO refactor
		if (this.ready) return;
		this.ready = true;

		this.camera = toCameraStore({width, height, x: width / 2, y: height / 2});
		// TODO this is a hint this should be a Svelte component ...
		this.subscriptions.push(this.camera.subscribe(($camera) => (this.$camera = $camera)));

		const collisions = (this.collisions = new Collisions());
		const sim = (this.sim = new Simulation(collisions));
		const {controller, friends} = this;
		const {bodies} = sim;

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		const player: EntityCircle = (this.player = collisions.createCircle(810, 502, 100) as any);
		player.speed = PLAYER_SPEED;
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
			-1450 + planetRadius / 2,
			-1750 + planetRadius / 2,
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
			2250 + rockSize / 2,
			1212 + rockSize / 2,
			rockSize,
		) as any);
		rock.speed = 0.07;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.ghostly = false;
		rock.color = COLOR_PLAIN;
		bodies.push(rock);

		let friend: EntityCircle = collisions.createCircle(1660, 1012, 33) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(1470, 1084, 42) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(2010, 872, 7) as any;
		friend.speed = 0.01;
		friend.directionX = -1;
		friend.directionY = -1;
		friend.ghostly = true;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(1870, 776, 14) as any;
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
		for (const subscription of this.subscriptions) {
			subscription();
		}
	}

	override update(dt: number): void {
		// TODO time dilation controls
		dt *= 3; // eslint-disable-line no-param-reassign
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

		// TODO refactor this to use queries or tags or at least helpers, it's un-dry and inefficient
		// TODO the rock and friend fragments buggily collide instead of the friend being destroyed sometimes

		super.update(dt);

		// gives stages full control over the sim `update`
		this.sim.update(dt);

		// TODO add a player controller component to handle this
		updateDirection(controller, player, this.$camera);

		// detect if player touches bounds for the first time
		// TODO pause during transition?
		if (this.freezeCamera && !this.bounds.collides(this.player)) {
			this.freezeCamera = false;
		}

		for (const friend of friends) {
			if (!rock.dead && !friend.dead && rock.collides(friend)) {
				const newFriendFragments = this.frag(friend, this.collisions, 12);
				friendFragments.push(...newFriendFragments);
				// TODO helper? dead+remove+?
				friend.dead = true;
				this.removeBody(friend);
				for (const friendFragment of newFriendFragments) {
					friendFragment.speed = randomFloat(rock.speed * 1.2, rock.speed * 2.44);
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
			const colliding =
				!friend.dead &&
				(rockFragments.find((r) => r.collides(friend)) ||
					planetFragments.find((r) => r.collides(friend)));
			if (colliding) {
				// TODO refactor with the code above
				const newFriendFragments = this.frag(friend, this.collisions, 12);
				friendFragments.push(...newFriendFragments);
				// TODO helper? dead+remove+?
				friend.dead = true;
				this.removeBody(friend);
				for (const friendFragment of newFriendFragments) {
					friendFragment.speed = randomFloat(colliding.speed / 8, colliding.speed);
					friendFragment.directionX = randomFloat(-colliding.directionX / 2, colliding.directionX);
					friendFragment.directionY = randomFloat(-colliding.directionY / 2, colliding.directionY);
					friendFragment.ghostly = false;
					friendFragment.color = COLOR_MOLTEN;
				}
				this.addBodies(newFriendFragments);
			}
		}

		let friendFragmentsToAdd: EntityBody[] | null = null;
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
			if (!friendFragment.dead) {
				if (!planet.dead && friendFragment.collides(planet)) {
					// TODO helper? dead+remove+?
					friendFragment.dead = true;
					this.removeBody(friendFragment);
				}
				for (const rockFragment of rockFragments) {
					if (!rockFragment.dead && friendFragment.collides(rockFragment)) {
						// TODO helper? dead+remove+?
						friendFragment.dead = true;
						this.removeBody(friendFragment);
					}
				}
				for (const friend of friends) {
					if (!friend.dead && friendFragment.collides(friend)) {
						// TODO refactor with the code above
						const newFriendFragments = this.frag(friend, this.collisions, 12);
						(friendFragmentsToAdd || (friendFragmentsToAdd = [])).push(...newFriendFragments);
						// TODO helper? dead+remove+?
						friend.dead = true;
						this.removeBody(friend);
						for (const newFriendFragment of friendFragmentsToAdd) {
							newFriendFragment.speed = randomFloat(
								friendFragment.speed / 2,
								friendFragment.speed * 2,
							);
							newFriendFragment.directionX = randomFloat(
								friendFragment.directionX / 2,
								friendFragment.directionX * 2,
							);
							newFriendFragment.directionY = randomFloat(
								friendFragment.directionY / 2,
								friendFragment.directionY * 2,
							);
							newFriendFragment.ghostly = false;
							newFriendFragment.color = COLOR_MOLTEN;
						}
					}
				}
			}
		}
		// this is no consistent physics lol
		if (friendFragmentsToAdd) {
			friendFragments.push(...friendFragmentsToAdd);
			this.addBodies(friendFragmentsToAdd);
		}
	}

	render(renderer: Renderer): void {
		renderer.clear();
		renderer.render(this.sim.bodies, this.$camera); // TODO factor out the `get`
	}

	resize(width: number, height: number): void {
		this.bounds.scale_x = width;
		this.bounds.scale_y = height;
		this.camera.update(($camera) => ({...$camera, width, height}), {hard: true}); // eslint-disable-line @typescript-eslint/no-floating-promises
	}
}
