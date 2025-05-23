import {random_float} from '@ryanatkn/belt/random.js';
import {get, writable, type Writable} from 'svelte/store';
import {dequal} from 'dequal/lite';
import type {Hsl} from '@ryanatkn/belt/colors.js';

import {collide, frag} from '$lib/entityHelpers.js';
import {type StageOptions, Stage as BaseStage} from '$lib/stage.js';
import type {EntityCircle} from '$lib/entityBody.js';
import {DEFAULT_STRENGTH, Entity} from '$lib/entity.js';
import {update_direction} from '$lib/controller.js';

// TODO refactor somehow -- canvas requires DOM color strings, Pixi uses hex numbers,
// and our `Hsl` is good for fast manipulation
const COLOR_PLAYER: Hsl = [0.833, 0.76, 0.72];
const COLOR_PLANET: Hsl = [0.611, 1, 0.7];
const COLOR_MOON: Hsl = [0.389, 0.8, 0.6];
const COLOR_ROCK: Hsl = [0.12, 0.16, 0.5];
const COLOR_MOLTEN: Hsl = [0, 1, 0.5];

export const PLAYER_ICON = '🐢'; // TODO pick from MOON_ICONS
export const MOON_ICONS = ['💧', '🌱', '🌳', '🌿', '🌲'];
export const ROCK_ICON = '🪨';

export const PLAYER_SPEED = 0.6; // TODO this is
export const PLAYER_SPEED_BOOSTED = PLAYER_SPEED * 1.618;
export const PLAYER_STRENGTH = DEFAULT_STRENGTH * 0.96;
export const PLAYER_STRENGTH_BOOSTED = 1.09;
export const PLAYER_STRENGTH_BOOSTED1 = 0.01;
export const PLAYER_STRENGTH_BOOSTED2 = 0.01;
export const PLAYER_STRENGTH_BOOSTED3 = 0.01;
export const PLAYER_RADIUS = 100;

const MOON_SPEED = 0.03;
const ROCK_SPEED = 0.21;

const MAX_DT = 100; // max 10 fps

const toIconFontSize = (radius: number): number => radius * 1.4;

// TODO refactor all of these
export interface UnlockStageScores {
	bonus: number; // TODO ?
}
export const mergeScores = (
	existingScores: UnlockStageScores,
	newScores: UnlockStageScores | undefined,
): UnlockStageScores => {
	const finalScores = structuredClone(existingScores);
	if (!newScores) return finalScores;
	finalScores.bonus = Math.max(newScores.bonus, finalScores.bonus);
	return finalScores;
};
export const toScores = (stage: Stage): UnlockStageScores => {
	return {
		bonus: stage.bonus,
	};
};
export const toInitialScores = (stage: Stage): UnlockStageScores => ({
	bonus: stage.bonus,
});

export class Stage extends BaseStage {
	finished = false; // stops when the conditions are met and the player collides with the exit

	bonus = 0; // TODO is a placeholder

	// these are instantiated in `setup`
	player!: Entity<EntityCircle>;
	planet!: Entity<EntityCircle>;
	rock!: Entity<EntityCircle>;
	readonly moons: Set<Entity<EntityCircle>> = new Set();
	readonly moonsArray: Array<Entity<EntityCircle>> = []; // TODO hack to keep the current view code -- see in 2 places
	readonly moonFragments: Set<Entity<EntityCircle>> = new Set();
	readonly planetFragments: Set<Entity<EntityCircle>> = new Set();
	readonly rockFragments: Set<Entity<EntityCircle>> = new Set();

	// TODO refactor, is only used for the camera
	lastPlayerX = 0;
	lastPlayerY = 0;

	scores: Writable<UnlockStageScores>;
	updateScores(): void {
		const newScores = toScores(this);
		if (!dequal(newScores, get(this.scores))) this.scores.set(newScores);
	}

	constructor(options: StageOptions) {
		super(options);
		const {data} = options;

		const playerX = 850;
		const playerY = 502;

		if (!this.freezeCamera) {
			void this.camera.setPosition(playerX, playerY);
		}

		const {sim, collisions, controller, moons} = this;

		// TODO instead of casting we could pass `EntityPolygon` as type param right?
		// and improve the type safety compared to casting? though not sure it'll catch any bugs

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		const player = (this.player = new Entity(
			collisions.create_circle(playerX, playerY, PLAYER_RADIUS) as EntityCircle,
		));
		player.text = PLAYER_ICON;
		player.fontSize = toIconFontSize(player.radius);
		player.speed = data?.playerSpeed ?? PLAYER_SPEED; // TODO how to do with `playerSpeed`? entity with `name='player'` that we use for defaults here?
		player.strength = data?.playerStrength ?? PLAYER_STRENGTH; // TODO how to do with `playerSpeed`? entity with `name='player'` that we use for defaults here?
		player.color = COLOR_PLAYER;
		this.addEntity(player);

		// create the stuff
		// TODO create these programmatically from data
		const planetRadius = 1618;
		const planet = (this.planet = new Entity(
			collisions.create_circle(
				-1450 + planetRadius / 2,
				-1750 + planetRadius / 2,
				planetRadius,
			) as EntityCircle,
		));
		planet.text = MOON_ICONS[0];
		planet.textOffsetX = 850;
		planet.textOffsetY = 1150;
		planet.fontSize = 200;
		planet.color = COLOR_PLANET;
		this.addEntity(planet);

		// TODO how will this work for polygons?
		const rockSize = 262;
		const rock = (this.rock = new Entity(
			collisions.create_circle(2275 + rockSize / 2, 1200 + rockSize / 2, rockSize) as EntityCircle,
		));
		rock.speed = ROCK_SPEED;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.text = ROCK_ICON;
		rock.fontSize = toIconFontSize(rock.radius);
		rock.color = COLOR_ROCK;
		this.addEntity(rock);

		let moon = new Entity(collisions.create_circle(1660, 1012, 43) as EntityCircle);
		moon.text = MOON_ICONS[1];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		moon = new Entity(collisions.create_circle(1420, 1174, 72) as EntityCircle);
		moon.text = MOON_ICONS[2];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		moon = new Entity(collisions.create_circle(2010, 872, 19) as EntityCircle);
		moon.text = MOON_ICONS[3];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		moon = new Entity(collisions.create_circle(1870, 776, 27) as EntityCircle);
		moon.text = MOON_ICONS[4];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		// TODO hack to keep the current view code -- see in 2 places
		this.moonsArray.push(...moons);

		this.scores = writable(toScores(this));
	}

	override update(_dt: number): void {
		const dt = this.timeDilation * Math.min(Math.max(_dt, 0), MAX_DT);
		super.update(dt);

		const {
			collisions,
			controller,
			player,
			planet,
			rock,
			moons,
			planetFragments,
			moonFragments,
			rockFragments,
			$camera,
		} = this;

		// TODO add a player controller component to handle this
		update_direction(controller, player, $camera);

		// TODO the `as any` is needed because flow control doesn't account for the callbacks setting this
		let rockFragmentsToAdd: Array<Entity<EntityCircle>> | null = null as any;
		let planetFragmentsToAdd: Array<Entity<EntityCircle>> | null = null as any;
		let moonFragmentsToAdd: Array<Entity<EntityCircle>> | null = null as any;

		let shouldUpdateScores = false;

		// gives stages full control over the sim `update`
		this.sim.update(
			dt,
			(entityA, entityB, result) => {
				collide(entityA, entityB, result);

				// TODO remove all these casts somehow
				// TODO refactor into a system
				const _rock = rock === entityA ? entityA : rock === entityB ? entityB : null;
				const _planet = planet === entityA ? entityA : planet === entityB ? entityB : null;
				const _moon = moons.has(entityA as Entity<EntityCircle>)
					? entityA
					: moons.has(entityB as Entity<EntityCircle>)
						? entityB
						: null;
				const _rockFragment = rockFragments.has(entityA as Entity<EntityCircle>)
					? entityA
					: rockFragments.has(entityB as Entity<EntityCircle>)
						? entityB
						: null;
				const _planetFragment = planetFragments.has(entityA as Entity<EntityCircle>)
					? entityA
					: planetFragments.has(entityB as Entity<EntityCircle>)
						? entityB
						: null;
				const _moonFragment = moonFragments.has(entityA as Entity<EntityCircle>)
					? entityA
					: moonFragments.has(entityB as Entity<EntityCircle>)
						? entityB
						: null;

				const _molten = _rock || _rockFragment || _planetFragment || _moonFragment;
				if (_moon && _molten) {
					// handle collision between moon and anything molten
					const moltenIsRock = _molten === _rock;
					const moltenIsMoonFragment = _molten === _moonFragment;
					const newMoonFragments = frag(_moon, collisions, 12) as Array<Entity<EntityCircle>>;
					shouldUpdateScores = true;
					(moonFragmentsToAdd || (moonFragmentsToAdd = [])).push(...newMoonFragments);
					this.removeEntity(_moon);
					// TODO this logic is very hardcoded -- ideally it's all simulated,
					// but we'd need to ensure the gameplay still works,
					// which may be tricky or impossible without some ridiculous physics
					// because things are hardcoded in a particular way for gameplay outcomes
					// (like the fixed velocities of moving objects, and vectors/speeds after fragging)
					for (const f of newMoonFragments) {
						f.speed = moltenIsRock
							? random_float(_molten.speed * 1.2, _molten.speed * 2.44)
							: moltenIsMoonFragment
								? random_float(_molten.speed / 2, _molten.speed * 2)
								: random_float(_molten.speed / 8, _molten.speed);
						f.directionX = moltenIsRock
							? random_float(_molten.directionX / 2, _molten.directionX * 2)
							: moltenIsMoonFragment
								? random_float(_molten.directionX / 2, _molten.directionX * 2)
								: random_float(-_molten.directionX / 2, _molten.directionX);
						f.directionY = moltenIsRock
							? random_float(_molten.directionY / 2, _molten.directionY * 2)
							: moltenIsMoonFragment
								? random_float(_molten.directionY / 2, _molten.directionY * 2)
								: random_float(-_molten.directionY / 2, _molten.directionY);
						f.color = COLOR_MOLTEN;
					}
				} else if (_rock && _planet) {
					// handle collision between rock and planet
					this.removeEntity(_rock);
					this.removeEntity(_planet);
					const newPlanetFragments = frag(_planet, collisions, 42) as Array<Entity<EntityCircle>>;
					shouldUpdateScores = true;
					(planetFragmentsToAdd || (planetFragmentsToAdd = [])).push(...newPlanetFragments);
					for (const p of newPlanetFragments) {
						p.speed = _rock.speed * 0.2 * random_float(0.5, 1.0);
						p.directionX = random_float(-_rock.directionX / 2, _rock.directionX / 2);
						p.directionY = random_float(-_rock.directionY / 2, _rock.directionY / 2);
						p.color = COLOR_MOLTEN;
					}
					const newRockFragments = frag(_rock, collisions, 210) as Array<Entity<EntityCircle>>;
					(rockFragmentsToAdd || (rockFragmentsToAdd = [])).push(...newRockFragments);
					for (const r of newRockFragments) {
						r.speed = random_float(_rock.speed / 2, _rock.speed * 2);
						r.directionX = random_float(-_rock.directionX * 2, _rock.directionX * 0.25);
						r.directionY = random_float(-_rock.directionY * 2, _rock.directionY * 0.25);
					}
				} else if (_moonFragment && (_planet || _planetFragment || _rockFragment)) {
					// TODO this logic is very similar to _molten but need to avoid double counting the same _moonFragment
					// handle collision between moon fragment and anything molten except other moon fragments
					this.removeEntity(_moonFragment);
				}
			},
			(bodyA, bodyB) => {
				const entityA = bodyA.entity;
				const entityB = bodyB.entity;
				if (
					entityA.dead ||
					entityB.dead ||
					entityA.disableSimulation ||
					entityB.disableSimulation
				) {
					return false;
				}

				// TODO make a system for declaring collision groups -- bitmask?
				const _player = player === entityA ? entityA : player === entityB ? entityB : null;
				const _planet = planet === entityA ? entityA : planet === entityB ? entityB : null;
				const _moon = moons.has(entityA as Entity<EntityCircle>)
					? entityA
					: moons.has(entityB as Entity<EntityCircle>)
						? entityB
						: null;
				if (_player && (_planet || _moon)) {
					return false; // player doesn't collide with these
				}
				return true;
			},
		);

		const {x: playerX, y: playerY} = player;
		if (this.freezeCamera) {
			// TODO make this generic
			// TODO I tried to use an inverted collision test with `this.innerPlayerBounds`
			// but without a collision result,
			// we'll need a more complex algorithm to "contain" items inside others
			const clampedRadius = player.radius + 1; // avoid the minor visual quirk of the border being rendered offscreen
			const xMin = $camera.left + clampedRadius;
			const xMax = $camera.right - clampedRadius;
			if (playerX < xMin) {
				player.x = xMin;
			} else if (playerX > xMax) {
				player.x = xMax;
			}
			const yMin = $camera.top + clampedRadius;
			const yMax = $camera.bottom - clampedRadius;
			if (playerY < yMin) {
				player.y = yMin;
			} else if (playerY > yMax) {
				player.y = yMax;
			}
		} else {
			if (playerX !== this.lastPlayerX || playerY !== this.lastPlayerY) {
				// TODO different algorithms for tracking the player with the camera (`camera.follow` option?)
				void this.camera.setPosition(playerX, playerY);
				this.lastPlayerX = playerX;
				this.lastPlayerY = playerY;
			}
		}

		// TODO how to make this generic? could wrap in an object
		// with a `type` if we have to, don't want the garbage tho
		if (rockFragmentsToAdd) {
			for (const r of rockFragmentsToAdd) {
				rockFragments.add(r);
				this.addEntity(r);
			}
		}
		if (planetFragmentsToAdd) {
			for (const p of planetFragmentsToAdd) {
				planetFragments.add(p);
				this.addEntity(p);
			}
		}
		if (moonFragmentsToAdd) {
			for (const f of moonFragmentsToAdd) {
				moonFragments.add(f);
				this.addEntity(f);
			}
		}

		if (shouldUpdateScores) {
			this.updateScores();
		}
	}
}
