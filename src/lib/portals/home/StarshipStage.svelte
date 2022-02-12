<script lang="ts">
	import World from '$lib/flat/World.svelte';
	import {Stage} from '$lib/portals/home/starshipStage';
	import {getClock} from '$lib/app/clockStore';

	export let starshipReady: boolean;
	export let starshipX = 0;
	export let starshipY = 0;
	export let starshipRotation = 0;
	export let exitStarshipMode: () => void;

	const clock = getClock();

	let height: number;
	let width: number;

	let turningLeft = false;
	let turningRight = false;
	let movingForward = false;
	let movingBackward = false;
	$: starshipReady && updateMovement($clock.dt);
	const ROTATE_INCREMENT = Math.PI * 0.0013;
	const MOVEMENT_INCREMENT = 0.3; // TODO velocity?
	const updateMovement = (dt: number) => {
		const turning = (turningLeft ? -1 : 0) + (turningRight ? 1 : 0);
		if (turning) {
			starshipRotation += turning * ROTATE_INCREMENT * dt; // TODO probably modulo `Math.PI * 2` but it's funny how much it spins
		}
		const moving = (movingForward ? 1 : 0) + (movingBackward ? -1 : 0);
		if (moving) {
			starshipX += moving * Math.sin(starshipRotation) * MOVEMENT_INCREMENT * dt;
			starshipY += -moving * Math.cos(starshipRotation) * MOVEMENT_INCREMENT * dt;
		}
	};
	const onKeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft':
			case 'a': {
				turningLeft = true;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				turningRight = true;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				movingForward = true;
				break;
			}
			case 'ArrowDown':
			case 's': {
				movingBackward = true;
				break;
			}
			case 'Escape': {
				exitStarshipMode();
				break;
			}
		}
	};
	const onKeyup = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft':
			case 'a': {
				turningLeft = false;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				turningRight = false;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				movingForward = false;
				break;
			}
			case 'ArrowDown':
			case 's': {
				movingBackward = false;
				break;
			}
		}
	};
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<!-- TODO maybe instead use ResizeObserver? the iframe measuring feels unfortunate -->
<div class="starship-stage" bind:clientHeight={height} bind:clientWidth={width}>
	<World {width} {height} stages={[Stage]} />
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
