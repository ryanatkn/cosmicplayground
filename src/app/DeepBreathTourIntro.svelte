<script>
	import {onDestroy, onMount} from 'svelte';

	import {blur} from 'svelte/transition';

	// Some of these props are weird
	// but the parent needs to know how long the total duration is
	// before the component gets mounted. (unless we refactor things in a weird way)
	// We could change this and `DeepBreathTourTitle` to use a common component,
	// but I might want to customize behavior further,
	// and I'm doubting the reusability mileage of that much abstraction.

	export let hide;
	export let totalDuration;
	export let transitionInDuration;
	export let transitionOutDuration;
	export let maxDelay;

	// TODO better visual effect? typewriter?

	// transition vars
	const text2Delay = Math.min(maxDelay, 2000);
	const blurAmount = 99;

	$: textStyle = `animation-duration: ${totalDuration}ms;`;

	let timeout;
	onMount(() => {
		timeout = setTimeout(() => hide(), totalDuration - transitionOutDuration);
	});
	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="tour-title" out:blur={{duration: transitionOutDuration, amount: blurAmount}}>
	<div class="text" style={textStyle}>
		<div in:blur={{duration: transitionInDuration, amount: blurAmount}}>
			If all ice on
			<span class="earth-text">Earth</span>
			melts,
		</div>
	</div>
	<div class="text" style={textStyle}>
		<div in:blur={{duration: transitionInDuration, amount: blurAmount, delay: text2Delay}}>
			how will sea levels change?
		</div>
	</div>
	<div class="text final-text" style={textStyle}>
		<div in:blur={{duration: transitionInDuration, amount: blurAmount, delay: maxDelay}}>
			This is a rough sketch.
		</div>
	</div>
</div>

<style>
	.tour-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 64px;
		line-height: 1.5;
		font-weight: 300;
		padding-bottom: 40px; /* center the text slightly better */
		overflow: hidden; /* lazy hack for small screens, assuming 1080p or larger */
	}
	.earth-text {
		color: var(--ocean_text_color);
	}
	.text {
		animation-name: gently-grow;
		animation-timing-function: linear;
		transform-origin: center;
	}
	.final-text {
		animation-name: gently-shrink;
		margin-top: 64px;
	}
	@keyframes gently-grow {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(1.31, 1.31, 1.31);
		}
	}
	@keyframes gently-shrink {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(0.87, 0.87, 0.87);
		}
	}
</style>
