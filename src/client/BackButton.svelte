<script>
	import {scale} from 'svelte/transition';

	export let isIdle = false;
</script>

<a href="#portals" class:idle={isIdle} in:scale={{duration: 167}} aria-label="go back">⇦</a>

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
	.idle {
		opacity: 0;
	}
</style>
