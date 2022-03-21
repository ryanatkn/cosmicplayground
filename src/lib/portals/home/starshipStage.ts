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
import {collideRigidBodies} from '$lib/flat/collideRigidBodies';

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
export const PLAYER_RADIUS = 100;

// TODO rewrite this to use a route Svelte component? `dealt.dev/tar/home`

// TODO what if this file were named `home.stage.ts` instead of `0__home.ts` ?

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
	freezeCamera = true; // is the camera fixed in place?
	lockCamera = true; // is the player stuck inside the bounds of the camera?

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

		// TODO instead of casting we could pass `EntityPolygon` as type param right?
		// and improve the type safety compared to casting? though not sure it'll catch any bugs

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		const player = (this.player = collisions.createCircle(810, 502, PLAYER_RADIUS) as EntityCircle);
		player.speed = PLAYER_SPEED;
		player.directionX = 0;
		player.directionY = 0;
		player.color = COLOR_PLAYER;
		bodies.push(player);

		// create the bounds around the stage edges
		const bounds = (this.bounds = collisions.createPolygon(0, 0, [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
		]) as EntityPolygon);
		bounds.invisible = true;
		bounds.scale_x = width;
		bounds.scale_y = height;
		bodies.push(bounds);

		// create the stuff
		// TODO create these programmatically from data
		const planetRadius = 1618;
		const planet = (this.planet = collisions.createCircle(
			-1450 + planetRadius / 2,
			-1750 + planetRadius / 2,
			planetRadius,
		) as EntityCircle);
		planet.speed = 0;
		planet.directionX = 0;
		planet.directionY = 0;
		planet.color = COLOR_DEFAULT;
		bodies.push(planet);

		// TODO how will this work for polygons?
		const rockSize = 262;
		const rock = (this.rock = collisions.createCircle(
			2250 + rockSize / 2,
			1212 + rockSize / 2,
			rockSize,
		) as EntityCircle);
		rock.speed = 0.07;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.color = COLOR_PLAIN;
		bodies.push(rock);

		let friend = collisions.createCircle(1660, 1012, 33) as EntityCircle;
		friend.speed = 0.01;
		friend.directionX = 0;
		friend.directionY = 0;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(1470, 1084, 42) as EntityCircle;
		friend.speed = 0.01;
		friend.directionX = 0;
		friend.directionY = 0;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(2010, 872, 7) as EntityCircle;
		friend.speed = 0.01;
		friend.directionX = 0;
		friend.directionY = 0;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);

		friend = collisions.createCircle(1870, 776, 14) as EntityCircle;
		friend.speed = 0.01;
		friend.directionX = 0;
		friend.directionY = 0;
		friend.color = COLOR_EXIT;
		bodies.push(friend);
		friends.push(friend);
	}

	addBodies(bodies: EntityBody[]): void {
		this.sim.bodies.push(...bodies);
	}

	removeBody(body: EntityBody): void {
		body.dead = true;
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
			collisions,
			controller,
			bounds,
			player,
			planet,
			rock,
			friends,
			planetFragments,
			friendFragments,
			rockFragments,
			$camera,
		} = this;

		// TODO refactor this to use queries or tags or at least helpers, it's un-dry and inefficient
		// TODO the rock and friend fragments buggily collide instead of the friend being destroyed sometimes

		super.update(dt);

		// TODO add a player controller component to handle this
		updateDirection(controller, player, $camera);

		// TODO the `as any` is needed because flow control doesn't account for the callbacks setting this
		let rockFragmentsToAdd: EntityBody[] | null = null as any;
		let planetFragmentsToAdd: EntityBody[] | null = null as any;
		let friendFragmentsToAdd: EntityBody[] | null = null as any;

		// gives stages full control over the sim `update`
		this.sim.update(
			dt,
			(bodyA, bodyB, result) => {
				collideRigidBodies(bodyA, bodyB, result);

				// TODO refactor into a system
				const _rock = rock === bodyA ? bodyA : rock === bodyB ? bodyB : undefined;
				const _planet = planet === bodyA ? bodyA : planet === bodyB ? bodyB : undefined;
				const _friend = friends.includes(bodyA as EntityCircle)
					? bodyA
					: friends.includes(bodyB as EntityCircle)
					? bodyB
					: undefined;
				const _rockFragment = rockFragments.includes(bodyA as EntityCircle)
					? bodyA
					: rockFragments.includes(bodyB as EntityCircle)
					? bodyB
					: undefined;
				const _planetFragment = planetFragments.includes(bodyA as EntityCircle)
					? bodyA
					: planetFragments.includes(bodyB as EntityCircle)
					? bodyB
					: undefined;
				const _friendFragment = friendFragments.includes(bodyA as EntityCircle)
					? bodyA
					: friendFragments.includes(bodyB as EntityCircle)
					? bodyB
					: undefined;

				const _molten = _rock || _rockFragment || _planetFragment || _friendFragment;
				if (_friend && _molten) {
					// handle collision between friend and anything molten
					const moltenIsRock = _molten === _rock;
					const moltenIsFriendFragment = _molten === _friendFragment;
					const newFriendFragments = this.frag(_friend, collisions, 12);
					(friendFragmentsToAdd || (friendFragmentsToAdd = [])).push(...newFriendFragments);
					this.removeBody(_friend);
					// TODO this logic is very hardcoded -- ideally it's all simulated,
					// but we'd need to ensure the gameplay still works, which may be tricky or impossible
					for (const f of newFriendFragments) {
						f.speed = moltenIsRock
							? randomFloat(_molten.speed * 1.2, _molten.speed * 2.44)
							: moltenIsFriendFragment
							? randomFloat(_molten.speed / 2, _molten.speed * 2)
							: randomFloat(_molten.speed / 8, _molten.speed);
						f.directionX = moltenIsRock
							? randomFloat(_molten.directionX / 2, _molten.directionX * 2)
							: moltenIsFriendFragment
							? randomFloat(_molten.directionX / 2, _molten.directionX * 2)
							: randomFloat(-_molten.directionX / 2, _molten.directionX);
						f.directionY = moltenIsRock
							? randomFloat(_molten.directionY / 2, _molten.directionY * 2)
							: moltenIsFriendFragment
							? randomFloat(_molten.directionY / 2, _molten.directionY * 2)
							: randomFloat(-_molten.directionY / 2, _molten.directionY);
						f.color = COLOR_MOLTEN;
					}
				} else if (_rock && _planet) {
					// handle collision between rock and planet
					this.removeBody(_rock);
					this.removeBody(_planet);
					const newPlanetFragments = this.frag(_planet, collisions, 42);
					(planetFragmentsToAdd || (planetFragmentsToAdd = [])).push(...newPlanetFragments);
					for (const p of newPlanetFragments) {
						p.speed = _rock.speed * 0.2 * randomFloat(0.5, 1.0);
						p.directionX = randomFloat(-_rock.directionX / 2, _rock.directionX / 2);
						p.directionY = randomFloat(-_rock.directionY / 2, _rock.directionY / 2);
						p.color = COLOR_MOLTEN;
					}
					const newRockFragments = this.frag(_rock, collisions, 210);
					(rockFragmentsToAdd || (rockFragmentsToAdd = [])).push(...newRockFragments);
					for (const r of newRockFragments) {
						r.speed = randomFloat(_rock.speed / 2, _rock.speed * 2);
						r.directionX = randomFloat(-_rock.directionX * 2, _rock.directionX * 0.25);
						r.directionY = randomFloat(-_rock.directionY * 2, _rock.directionY * 0.25);
					}
				} else if (_friendFragment && (_planet || _planetFragment || _rockFragment)) {
					// TODO this logic is very similar to _molten but need to avoid double counting the same _friendFragment
					// handle collision between friend fragment and anything molten except other friend fragments
					this.removeBody(_friendFragment);
				}
			},
			(bodyA, bodyB) => {
				if (bodyA.dead || bodyB.dead) return false;
				if (bodyA === bounds || bodyB === bounds) return false; // TODO hmm
				// TODO BLOCK make this more efficient -- Sets for now maybe, bitmask later?
				// TODO make a system for declaring collision groups --
				// this logic determines what the player can ghost through
				const bodyAIsPlayer = player === bodyA;
				const bodyBIsPlayer = player === bodyB;
				const bodyAIsFriend = friends.includes(bodyA as EntityCircle);
				const bodyBIsFriend = friends.includes(bodyB as EntityCircle);
				const bodyAIsPlanet = planet === bodyA;
				const bodyBIsPlanet = planet === bodyB;
				if (
					(bodyAIsPlayer && (bodyBIsFriend || bodyBIsPlanet)) ||
					(bodyBIsPlayer && (bodyAIsFriend || bodyAIsPlanet))
				) {
					return false; // player doesn't collide with these
				}
				return true;
			},
		);

		if (this.freezeCamera) {
			if (this.lockCamera) {
				// TODO make this generic
				// TODO I tried to use an inverted collision test with `this.innerPlayerBounds`
				// but without a collision result,
				// we'll need a more complex algorithm to "contain" items inside others
				const clampedRadius = player.radius + 1; // avoid the minor visual quirk of the border being rendered offscreen
				const xMin = $camera.left + clampedRadius;
				const xMax = $camera.right - clampedRadius;
				if (player.x < xMin) {
					player.x = xMin;
				} else if (player.x > xMax) {
					player.x = xMax;
				}
				const yMin = $camera.top + clampedRadius;
				const yMax = $camera.bottom - clampedRadius;
				if (player.y < yMin) {
					player.y = yMin;
				} else if (player.y > yMax) {
					player.y = yMax;
				}
			} else if (!bounds.collides(player)) {
				// detect if player touches bounds for the first time, and unfreeze if so
				// TODO instead of the bounds, this should use `this.playerInnerBounds`,
				// which is related to clamping, but I don't think we gain anything by using it there, only here
				this.freezeCamera = false;
			}
		}

		// TODO how to make this generic?
		if (rockFragmentsToAdd) {
			rockFragments.push(...rockFragmentsToAdd);
			this.addBodies(rockFragmentsToAdd);
		}
		if (planetFragmentsToAdd) {
			planetFragments.push(...planetFragmentsToAdd);
			this.addBodies(planetFragmentsToAdd);
		}
		if (friendFragmentsToAdd) {
			friendFragments.push(...friendFragmentsToAdd);
			this.addBodies(friendFragmentsToAdd);
		}
	}

	render(renderer: Renderer): void {
		renderer.clear();
		renderer.render(this.sim.bodies, this.$camera);
	}

	resize(width: number, height: number): void {
		this.bounds.scale_x = width;
		this.bounds.scale_y = height;
		this.camera.setDimensions(width, height);
	}
}
