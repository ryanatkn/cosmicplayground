<script lang="ts">
	import World from '$lib/flat/World.svelte';
	import {Stage} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clockStore';
	import {type StageState} from '$lib/flat/stageState';

	export let width: number;
	export let height: number;
	$: console.log(`width, height`, width, height);
	export let starshipX = 0;
	export let starshipY = 0;
	export let currentStage: Stage | null;
	export let starshipAngle = 0;
	export let starshipShieldRadius = 0;
	export let disasterAverted: boolean;
	export let exitStarshipMode: () => void;

	const clock = getClock();

	let activeStageState: StageState<Stage> | null = null;

	$: activeStageState?.stage && syncStageState(activeStageState.stage, $clock.dt);

	// TODO this is clumsy
	const syncStageState = (stage: Stage, dt: number) => {
		starshipX = stage.player.x;
		starshipY = stage.player.y;
		// TODO ?
		starshipAngle = updateAngle(
			starshipAngle,
			stage.player.directionX,
			stage.player.directionY,
			dt,
		);
		if (!stage.freezeCamera) {
			stage.camera.update(($camera) => ({...$camera, x: starshipX, y: starshipY})); // eslint-disable-line @typescript-eslint/no-floating-promises
		}
		currentStage = stage;
		starshipShieldRadius = stage.player.radius;
		if (!disasterAverted) disasterAverted = stage.rockPassedFriends && stage.rockPassedPlanet;
		if (stage.controller.pressingExit) {
			exitStarshipMode();
		}
	};

	// const ROTATION_SPEED = 0.003;
	// let lastTargetAngle: number | undefined;
	// let rotationDirection = 1;
	// TODO simplify this, brute forcing the maths
	const updateAngle = (
		currentAngle: number,
		directionX: number,
		directionY: number,
		_dt: number, // TODO
	): number => {
		if (!directionX && !directionY) return currentAngle;
		return toTargetAngle(directionX, directionY);
		// TODO animate towards the angle instead of setting it directly - this code is very broken but leaving for context
		// let targetAngle = toTargetAngle(directionX, directionY);
		// while (targetAngle < 0) targetAngle += Math.PI * 2;
		// if (currentAngle === targetAngle) return currentAngle;
		// if (lastTargetAngle !== targetAngle) {
		// 	console.log(`targetAngle`, targetAngle);
		// 	lastTargetAngle = targetAngle;
		// 	rotationDirection = Math.abs(targetAngle - currentAngle) > Math.PI ? 1 : -1;
		// 	console.log(`rotationDirection`, rotationDirection);
		// }
		// // 1 is clockwide, -1 is counterclockwise
		// return rotationDirection > 0
		// 	? Math.max(currentAngle - ROTATION_SPEED * dt, targetAngle)
		// 	: Math.min(currentAngle + ROTATION_SPEED * dt, targetAngle);
	};
	const toTargetAngle = (directionX: number, directionY: number): number =>
		Math.atan2(directionY, directionX);
</script>

<!-- TODO maybe instead use ResizeObserver? the iframe measuring feels unfortunate -->
<div class="starship-stage">
	<World {width} {height} stages={[Stage]} bind:activeStageState />
</div>

<style>
	.starship-stage {
		position: absolute !important;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		text-align: center;
		justify-content: center;
	}
</style>
