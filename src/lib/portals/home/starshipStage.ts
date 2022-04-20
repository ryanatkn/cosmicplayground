import {Collisions} from '@ryanatkn/collisions';
import {randomFloat} from '@feltcoop/felt/util/random.js';
import {klona} from 'klona/json';

import {Stage as BaseStage, type StageSetupOptions} from '$lib/flat/stage';
import {frag, type EntityBody, type EntityCircle, type EntityPolygon} from '$lib/flat/entity';
import type {Renderer} from '$lib/flat/renderer';
import {Simulation} from '$lib/flat/Simulation';
import {updateDirection} from '$lib/flat/Controller';
import {
	type CameraStore,
	toCameraStore,
	type CameraState,
	SPRING_OPTS_HARD,
} from '$lib/flat/camera';
import {collideRigidBodies} from '$lib/flat/collideRigidBodies';

export const COLOR_DEFAULT = 'hsl(220, 100%, 70%)';
export const COLOR_PLAIN = 'hsl(220, 20%, 70%)';
export const COLOR_EXIT = 'hsl(140, 100%, 70%)';
export const COLOR_PLAYER = 'violet';
export const COLOR_MOLTEN = 'red';

export const MOON_ICONS = ['🐹', '🐸', '🐰', '🐼', '🐭'];

export const PLAYER_SPEED = 0.2;
export const PLAYER_SPEED_BOOSTED = PLAYER_SPEED * 1.618;
export const PLAYER_RADIUS = 100;

const toIconFont = (radius: number): string => `${radius * 1.4}px sans-serif`;

export interface StarshipStageScores {
	crew: boolean[]; // mirrors `MOON_ICONS`
	crewRescuedAtOnceCount: number;
}
export const toDefaultScores = (): StarshipStageScores => ({
	crew: MOON_ICONS.map(() => false),
	crewRescuedAtOnceCount: 0,
});
export const rescuedAnyCrew = (scores: StarshipStageScores): boolean => scores.crew.some(Boolean);
export const rescuedAllCrew = (scores: StarshipStageScores): boolean => scores.crew.every(Boolean);
export const rescuedAllMoons = (scores: StarshipStageScores): boolean =>
	scores.crew.slice(1).every(Boolean);
export const rescuedAllCrewAtOnce = (scores: StarshipStageScores): boolean =>
	scores.crew.length === scores.crewRescuedAtOnceCount;
export const mergeScores = (
	newScores: StarshipStageScores | undefined,
	existingScores: StarshipStageScores | undefined,
): StarshipStageScores => {
	const finalScores = existingScores ? klona(existingScores) : toDefaultScores();
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
const toCrewRescuedCount = (crew: boolean[]): number => crew.filter(Boolean).length;

export class Stage extends BaseStage {
	finished = false; // stops when the conditions are met and the player collides with the exit

	// these are instantiated in `setup`
	collisions!: Collisions;
	sim!: Simulation;
	player!: EntityCircle;
	bounds!: EntityPolygon;
	planet!: EntityCircle;
	rock!: EntityCircle;
	readonly moons: Set<EntityCircle> = new Set();
	readonly moonsArray: EntityCircle[] = []; // TODO hack to keep the current view code -- see in 2 places
	readonly moonFragments: Set<EntityCircle> = new Set();
	readonly planetFragments: Set<EntityCircle> = new Set();
	readonly rockFragments: Set<EntityCircle> = new Set();

	camera!: CameraStore;
	$camera!: CameraState;
	freezeCamera = true; // is the camera fixed in place?

	subscriptions: Array<() => void> = []; // TODO maybe use a component instead, for automatic lifecycle management?

	constructor(options: StageSetupOptions) {
		super(options);

		const {width, height, freezeCamera} = options;

		this.freezeCamera = freezeCamera;

		const playerX = 850;
		const playerY = 502;

		this.camera = toCameraStore({
			width,
			height,
			x: freezeCamera ? width / 2 : playerX,
			y: freezeCamera ? height / 2 : playerY,
		});
		// TODO this is a hint this should be a Svelte component ...
		this.subscriptions.push(this.camera.subscribe(($camera) => (this.$camera = $camera)));

		const collisions = (this.collisions = new Collisions());
		const sim = (this.sim = new Simulation(collisions));
		const {controller, moons} = this;
		const {bodies} = sim;

		// TODO instead of casting we could pass `EntityPolygon` as type param right?
		// and improve the type safety compared to casting? though not sure it'll catch any bugs

		console.log('setup stage, sim, controller', sim, controller);
		// create the controllable player
		const player = (this.player = collisions.createCircle(
			playerX,
			playerY,
			PLAYER_RADIUS,
		) as EntityCircle);
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
		bounds.disableSimulation = true;
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
		planet.text = MOON_ICONS[0];
		planet.textOffsetX = 850;
		planet.textOffsetY = 1150;
		planet.font = '200px sans-serif';
		planet.speed = 0;
		planet.directionX = 0;
		planet.directionY = 0;
		planet.color = COLOR_DEFAULT;
		bodies.push(planet);

		// TODO how will this work for polygons?
		const rockSize = 262;
		const rock = (this.rock = collisions.createCircle(
			2275 + rockSize / 2,
			1200 + rockSize / 2,
			rockSize,
		) as EntityCircle);
		rock.speed = 0.07;
		rock.directionX = -1;
		rock.directionY = -0.7;
		rock.color = COLOR_PLAIN;
		bodies.push(rock);

		let moon = collisions.createCircle(1660, 1012, 43) as EntityCircle;
		moon.text = MOON_ICONS[1];
		moon.font = toIconFont(moon.radius);
		moon.speed = 0.01;
		moon.directionX = 0;
		moon.directionY = 0;
		moon.color = COLOR_EXIT;
		bodies.push(moon);
		moons.add(moon);

		moon = collisions.createCircle(1420, 1104, 72) as EntityCircle;
		moon.text = MOON_ICONS[2];
		moon.font = toIconFont(moon.radius);
		moon.speed = 0.01;
		moon.directionX = 0;
		moon.directionY = 0;
		moon.color = COLOR_EXIT;
		bodies.push(moon);
		moons.add(moon);

		moon = collisions.createCircle(2010, 872, 19) as EntityCircle;
		moon.text = MOON_ICONS[3];
		moon.font = toIconFont(moon.radius);
		moon.speed = 0.01;
		moon.directionX = 0;
		moon.directionY = 0;
		moon.color = COLOR_EXIT;
		bodies.push(moon);
		moons.add(moon);

		moon = collisions.createCircle(1870, 776, 27) as EntityCircle;
		moon.text = MOON_ICONS[4];
		moon.font = toIconFont(moon.radius);
		moon.speed = 0.01;
		moon.directionX = 0;
		moon.directionY = 0;
		moon.color = COLOR_EXIT;
		bodies.push(moon);
		moons.add(moon);

		// TODO hack to keep the current view code -- see in 2 places
		this.moonsArray.push(...moons);
	}

	addBodies(bodies: EntityBody[]): void {
		this.sim.bodies.push(...bodies);
	}

	removeBody(body: EntityBody): void {
		body.dead = true;
		// TODO remove from the other collections? maybe after figuring out the tagging/type/bitmask system
		this.sim.removeBody(body);
	}

	destroy(): void {
		// TODO refactor this out, maybe move everything to a component?
		for (const subscription of this.subscriptions) {
			subscription();
		}
	}

	override update(dt: number): void {
		// TODO time dilation controls
		this.time += dt; // TODO maybe don't track this on the stage? clock?

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
		let rockFragmentsToAdd: EntityCircle[] | null = null as any;
		let planetFragmentsToAdd: EntityCircle[] | null = null as any;
		let moonFragmentsToAdd: EntityCircle[] | null = null as any;

		// gives stages full control over the sim `update`
		this.sim.update(
			dt * 3, // TODO !!!!!!!!!!!!!!!!!!!!!!!! dont do this, triple the speeds of everything or w/e
			(bodyA, bodyB, result) => {
				collideRigidBodies(bodyA, bodyB, result);

				// TODO remove all these casts somehow
				// TODO refactor into a system
				const _rock = rock === bodyA ? bodyA : rock === bodyB ? bodyB : null;
				const _planet = planet === bodyA ? bodyA : planet === bodyB ? bodyB : null;
				const _moon = moons.has(bodyA as EntityCircle)
					? bodyA
					: moons.has(bodyB as EntityCircle)
					? bodyB
					: null;
				const _rockFragment = rockFragments.has(bodyA as EntityCircle)
					? bodyA
					: rockFragments.has(bodyB as EntityCircle)
					? bodyB
					: null;
				const _planetFragment = planetFragments.has(bodyA as EntityCircle)
					? bodyA
					: planetFragments.has(bodyB as EntityCircle)
					? bodyB
					: null;
				const _moonFragment = moonFragments.has(bodyA as EntityCircle)
					? bodyA
					: moonFragments.has(bodyB as EntityCircle)
					? bodyB
					: null;

				const _molten = _rock || _rockFragment || _planetFragment || _moonFragment;
				if (_moon && _molten) {
					// handle collision between moon and anything molten
					const moltenIsRock = _molten === _rock;
					const moltenIsMoonFragment = _molten === _moonFragment;
					const newMoonFragments = frag(_moon, collisions, 12) as EntityCircle[];
					(moonFragmentsToAdd || (moonFragmentsToAdd = [])).push(...newMoonFragments);
					this.removeBody(_moon);
					// TODO this logic is very hardcoded -- ideally it's all simulated,
					// but we'd need to ensure the gameplay still works, which may be tricky or impossible
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
					this.removeBody(_rock);
					this.removeBody(_planet);
					const newPlanetFragments = frag(_planet, collisions, 42) as EntityCircle[];
					(planetFragmentsToAdd || (planetFragmentsToAdd = [])).push(...newPlanetFragments);
					for (const p of newPlanetFragments) {
						p.speed = _rock.speed * 0.2 * randomFloat(0.5, 1.0);
						p.directionX = randomFloat(-_rock.directionX / 2, _rock.directionX / 2);
						p.directionY = randomFloat(-_rock.directionY / 2, _rock.directionY / 2);
						p.color = COLOR_MOLTEN;
					}
					const newRockFragments = frag(_rock, collisions, 210) as EntityCircle[];
					(rockFragmentsToAdd || (rockFragmentsToAdd = [])).push(...newRockFragments);
					for (const r of newRockFragments) {
						r.speed = randomFloat(_rock.speed / 2, _rock.speed * 2);
						r.directionX = randomFloat(-_rock.directionX * 2, _rock.directionX * 0.25);
						r.directionY = randomFloat(-_rock.directionY * 2, _rock.directionY * 0.25);
					}
				} else if (_moonFragment && (_planet || _planetFragment || _rockFragment)) {
					// TODO this logic is very similar to _molten but need to avoid double counting the same _moonFragment
					// handle collision between moon fragment and anything molten except other moon fragments
					this.removeBody(_moonFragment);
				}
			},
			(bodyA, bodyB) => {
				if (bodyA.dead || bodyB.dead || bodyA.disableSimulation || bodyB.disableSimulation) {
					return false;
				}

				// TODO make a system for declaring collision groups -- bitmask?
				const _player = player === bodyA ? bodyA : player === bodyB ? bodyB : null;
				const _planet = planet === bodyA ? bodyA : planet === bodyB ? bodyB : null;
				const _moon = moons.has(bodyA as EntityCircle)
					? bodyA
					: moons.has(bodyB as EntityCircle)
					? bodyB
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
			for (const r of rockFragmentsToAdd) rockFragments.add(r);
			this.addBodies(rockFragmentsToAdd);
		}
		if (planetFragmentsToAdd) {
			for (const p of planetFragmentsToAdd) planetFragments.add(p);
			this.addBodies(planetFragmentsToAdd);
		}
		if (moonFragmentsToAdd) {
			for (const f of moonFragmentsToAdd) moonFragments.add(f);
			this.addBodies(moonFragmentsToAdd);
		}
	}

	render(renderer: Renderer): void {
		renderer.clear();
		renderer.render(this.sim.bodies, this.$camera);
		// TODO batch render? or maybe just use pixi? see in 2 places
		// renderer.render([this.rock], this.$camera);
		// renderer.render(this.rockFragments, this.$camera);
		// renderer.render([this.planet], this.$camera);
		// renderer.render(this.planetFragments, this.$camera);
		// renderer.render(this.moons, this.$camera);
		// renderer.render(this.moonFragments, this.$camera);
		// renderer.render([this.player], this.$camera);
	}

	resize(width: number, height: number): void {
		this.bounds.scale_x = width;
		this.bounds.scale_y = height;
		this.camera.setDimensions(width, height);
		if (this.freezeCamera) void this.camera.setPosition(width / 2, height / 2, SPRING_OPTS_HARD);
	}
}
