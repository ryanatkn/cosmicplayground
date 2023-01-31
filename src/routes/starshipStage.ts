import {randomFloat} from '@feltcoop/util/random.js';
import {get, writable, type Writable} from 'svelte/store';
import {dequal} from 'dequal/lite';

import {Stage as BaseStage, type StageSetupOptions} from '$lib/flat/Stage';
import type {EntityCircle} from '$lib/flat/entityBody';
import {frag, collide} from '$lib/flat/entityHelpers';
import {updateDirection} from '$lib/flat/Controller';
import type {Hsl} from '$lib/util/colors';
import {DEFAULT_STRENGTH, Entity} from '$lib/flat/Entity';

// TODO refactor somehow -- canvas requires DOM color strings, Pixi uses hex numbers,
// and our `Hsl` is good for fast manipulation
const COLOR_PLAYER: Hsl = [0.833, 0.76, 0.72];
const COLOR_PLANET: Hsl = [0.611, 1, 0.7];
const COLOR_MOON: Hsl = [0.389, 0.8, 0.6];
const COLOR_ROCK: Hsl = [0.12, 0.16, 0.5];
const COLOR_MOLTEN: Hsl = [0, 1, 0.5];

export const MOON_ICONS = ['🐹', '🐰', '🐸', '🐼', '🐭'];

export const PLAYER_SPEED = 0.6;
export const PLAYER_SPEED_BOOSTED = PLAYER_SPEED * 1.618;
export const PLAYER_STRENGTH = DEFAULT_STRENGTH * 0.97;
export const PLAYER_STRENGTH_BOOSTED = 1.09;
export const PLAYER_STRENGTH_BOOSTED1 = 0.01;
export const PLAYER_STRENGTH_BOOSTED2 = 0.01;
export const PLAYER_STRENGTH_BOOSTED3 = 0.01;
export const PLAYER_RADIUS = 100;

export const MOON_SPEED = 0.03;
export const ROCK_SPEED = 0.21;
export const ROCK_STRENGTH = DEFAULT_STRENGTH * 1.03;

// end conditions
export const ROCK_TIMER_FOR_THRESHOLD = 0; // time after passing x threshold for ending the stage
export const ROCK_TIMER_X_MIN = -1400;
export const ROCK_TIMER_Y_MIN = -3000;
export const ROCK_TIMER_X_MAX = 2800;
export const ROCK_TIMER_Y_MAX = 1800;
export const ROCK_TIMER_DEAD = 15000; // time after rock dies before ending the stage

const MAX_DT = 100; // max 10 fps

const toIconFontSize = (radius: number): number => radius * 1.4;

// TODO refactor all of these
export interface StarshipStageScores {
	// stay in sync with `parseStarshipStageScores`!
	crew: boolean[]; // mirrors `MOON_ICONS`
	crewRescuedAtOnceCount: number;
}
export const parseStarshipStageScores = (str: string): StarshipStageScores | undefined => {
	try {
		const parsed = JSON.parse(str);
		if (!parsed || typeof parsed !== 'object') return undefined;
		// manually validating `StarshipStageScores`, TODO schema (try zod?)
		if (
			Array.isArray(parsed.crew) &&
			parsed.crew.every((c: any) => typeof c === 'boolean') &&
			typeof parsed.crewRescuedAtOnceCount === 'number'
		) {
			return parsed;
		}
	} catch (err) {
		//
	}
	return undefined;
};
export const rescuedAnyCrew = (scores: StarshipStageScores): boolean => scores.crew.some(Boolean);
export const rescuedAllCrew = (scores: StarshipStageScores): boolean => scores.crew.every(Boolean);
export const rescuedAllMoons = (scores: StarshipStageScores): boolean =>
	scores.crew.slice(1).every(Boolean);
export const rescuedAllCrewAtOnce = (scores: StarshipStageScores): boolean =>
	scores.crew.length === scores.crewRescuedAtOnceCount;
export const mergeScores = (
	existingScores: StarshipStageScores,
	newScores: StarshipStageScores | undefined,
): StarshipStageScores => {
	const finalScores = structuredClone(existingScores);
	if (!newScores) return finalScores;
	for (let i = 0; i < newScores.crew.length; i++) {
		if (newScores.crew[i]) finalScores.crew[i] = true;
	}
	// TODO would be cool to track the rescued combos and give special messages/behaviors/achievements,
	// for example could show what the player achieved with each combination of enhancements (speed, unlock, push)
	finalScores.crewRescuedAtOnceCount = Math.max(
		toCrewRescuedCount(newScores.crew),
		finalScores.crewRescuedAtOnceCount,
	);
	return finalScores;
};
export const toScores = (stage: Stage): StarshipStageScores => {
	const crew = [!stage.planet.dead, ...stage.moonsArray.map((moon) => !moon.dead)];
	return {
		crew,
		crewRescuedAtOnceCount: toCrewRescuedCount(crew),
	};
};
export const toInitialScores = (stage: Stage): StarshipStageScores => ({
	crew: [false, ...stage.moonsArray.map(() => false)],
	crewRescuedAtOnceCount: 0,
});
const toCrewRescuedCount = (crew: boolean[]): number => crew.filter(Boolean).length;

export class Stage extends BaseStage {
	finished = false; // stops when the conditions are met and the player collides with the exit

	// these are instantiated in `setup`
	player!: Entity<EntityCircle>;
	planet!: Entity<EntityCircle>;
	rock!: Entity<EntityCircle>;
	readonly moons: Set<Entity<EntityCircle>> = new Set();
	readonly moonsArray: Array<Entity<EntityCircle>> = []; // TODO hack to keep the current view code -- see in 2 places
	readonly moonFragments: Set<Entity<EntityCircle>> = new Set();
	readonly planetFragments: Set<Entity<EntityCircle>> = new Set();
	readonly rockFragments: Set<Entity<EntityCircle>> = new Set();

	scores: Writable<StarshipStageScores>;
	updateScores(): void {
		const newScores = toScores(this);
		if (!dequal(newScores, get(this.scores))) this.scores.set(newScores);
	}

	constructor(options: StageSetupOptions) {
		super(options);

		const playerX = 850;
		const playerY = 502;

		if (!this.freezeCamera) {
			void this.camera.setPosition(playerX, playerY, {hard: true});
		}

		const {sim, collisions, controller, moons} = this;

		// TODO instead of casting we could pass `EntityPolygon` as type param right?
		// and improve the type safety compared to casting? though not sure it'll catch any bugs

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		const player = (this.player = new Entity(
			collisions.createCircle(playerX, playerY, PLAYER_RADIUS) as EntityCircle,
		));
		player.speed = PLAYER_SPEED;
		player.color = COLOR_PLAYER;
		this.addEntity(player);

		// create the stuff
		// TODO create these programmatically from data
		const planetRadius = 1618;
		const planet = (this.planet = new Entity(
			collisions.createCircle(
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
			collisions.createCircle(2275 + rockSize / 2, 1200 + rockSize / 2, rockSize) as EntityCircle,
		));
		rock.speed = ROCK_SPEED;
		rock.strength = ROCK_STRENGTH;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.color = COLOR_ROCK;
		this.addEntity(rock);

		let moon = new Entity(collisions.createCircle(1660, 1012, 43) as EntityCircle);
		moon.text = MOON_ICONS[1];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		moon = new Entity(collisions.createCircle(1420, 1174, 72) as EntityCircle);
		moon.text = MOON_ICONS[2];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		moon = new Entity(collisions.createCircle(2010, 872, 19) as EntityCircle);
		moon.text = MOON_ICONS[3];
		moon.fontSize = toIconFontSize(moon.radius);
		moon.speed = MOON_SPEED;
		moon.color = COLOR_MOON;
		this.addEntity(moon);
		moons.add(moon);

		moon = new Entity(collisions.createCircle(1870, 776, 27) as EntityCircle);
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

	rockTimer: number | null = null;

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
		updateDirection(controller, player, $camera);

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
							? randomFloat(_molten.speed * 1.2, _molten.speed * 2.44)
							: moltenIsMoonFragment
							? randomFloat(_molten.speed / 2, _molten.speed * 2)
							: randomFloat(_molten.speed / 8, _molten.speed);
						f.directionX = moltenIsRock
							? randomFloat(_molten.directionX / 2, _molten.directionX * 2)
							: moltenIsMoonFragment
							? randomFloat(_molten.directionX / 2, _molten.directionX * 2)
							: randomFloat(-_molten.directionX / 2, _molten.directionX);
						f.directionY = moltenIsRock
							? randomFloat(_molten.directionY / 2, _molten.directionY * 2)
							: moltenIsMoonFragment
							? randomFloat(_molten.directionY / 2, _molten.directionY * 2)
							: randomFloat(-_molten.directionY / 2, _molten.directionY);
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
						p.speed = _rock.speed * 0.2 * randomFloat(0.5, 1.0);
						p.directionX = randomFloat(-_rock.directionX / 2, _rock.directionX / 2);
						p.directionY = randomFloat(-_rock.directionY / 2, _rock.directionY / 2);
						p.color = COLOR_MOLTEN;
					}
					const newRockFragments = frag(_rock, collisions, 210) as Array<Entity<EntityCircle>>;
					(rockFragmentsToAdd || (rockFragmentsToAdd = [])).push(...newRockFragments);
					for (const r of newRockFragments) {
						r.speed = randomFloat(_rock.speed / 2, _rock.speed * 2);
						r.directionX = randomFloat(-_rock.directionX * 2, _rock.directionX * 0.25);
						r.directionY = randomFloat(-_rock.directionY * 2, _rock.directionY * 0.25);
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

		if (this.freezeCamera) {
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

		// when rock passes the X threshold or it's destroyed,
		// start a fixed timer to end the stage, enough to let most fragments pass
		if (!this.finished) {
			if (this.rockTimer === null) {
				if (rock.dead) {
					this.rockTimer = ROCK_TIMER_DEAD;
				} else if (
					rock.x < ROCK_TIMER_X_MIN ||
					rock.y < ROCK_TIMER_Y_MIN ||
					rock.x > ROCK_TIMER_X_MAX ||
					rock.y > ROCK_TIMER_Y_MAX
				) {
					this.rockTimer = ROCK_TIMER_FOR_THRESHOLD;
				}
			} else {
				this.rockTimer -= dt;
				if (this.rockTimer <= 0) {
					this.finished = true;
				}
			}
		}
	}
}
