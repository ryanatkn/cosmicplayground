<script>
	import {onDestroy} from 'svelte';

	export let hideWhenIdle = false;
	export let idleIntervalTime = 1000;
	export let timeToGoIdle = 6000;

	let idle = false;
	let interval;
	let idleTimer = 0;

	const updateIdleState = () => {
		if (idle) return;
		idleTimer += idleIntervalTime;
		if (idleTimer >= timeToGoIdle) {
			idle = true;
		}
	};

	$: {
		clearInterval(interval);
		if (hideWhenIdle) {
			console.log('set interval');
			interval = setInterval(updateIdleState, idleIntervalTime);
		}
	}
	onDestroy(() => clearInterval(interval));

	const onMouseMove = () => {
		idleTimer = 0;
		if (idle) idle = false;
	};
</script>

<svelte:window on:mousemove={hideWhenIdle ? onMouseMove : undefined} />

<a href="#portals" class:idle>⇦</a>

<style>
	a {
		display: block;
		cursor: pointer;
		font-size: 80px;
		opacity: 0.6;
		color: hsla(130, 20%, 90%, 0.9);
		transition: transform 0.06s ease-out, opacity 0.5s linear;
		transform-origin: center center;
		padding-left: 20px;
	}
	a:hover {
		opacity: 0.8;
		transform: scale3d(1.2, 1.2, 1);
	}
	a:active {
		opacity: 0.95;
		transform: scale3d(1.42, 1.42, 1);
	}
	a.idle {
		opacity: 0;
	}
</style>
