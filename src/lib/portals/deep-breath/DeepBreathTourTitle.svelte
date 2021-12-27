<script>
	import {onDestroy, onMount} from 'svelte';
	import {blur} from 'svelte/transition';

	export let hide;
	export let transitionDuration;
	export let pauseDuration;
	export let maxDelay;

	// transition vars
	const blurAmount = 99;

	$: animationDuration = transitionDuration * 2 + pauseDuration;
	$: textStyle = `animation-duration: ${animationDuration}ms;`;

	let timeout;
	onMount(() => {
		timeout = setTimeout(() => hide(), transitionDuration + maxDelay + pauseDuration);
	});
	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="tour-title" out:blur={{duration: transitionDuration, amount: blurAmount}}>
	<div class="text" style={textStyle}>
		<div in:blur={{duration: transitionDuration, amount: blurAmount}}>deep</div>
	</div>
	<div class="text" style={textStyle}>
		<div in:blur={{duration: transitionDuration, amount: blurAmount, delay: maxDelay}}>breath</div>
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
		font-size: 419px;
		line-height: 1.15;
		font-weight: 900;
		color: var(--ocean_text_color);
		padding-bottom: 40px; /* center the text slightly better */
		overflow: hidden; /* lazy hack for small screens, assuming 1080p or larger */
		cursor: default;
		user-select: none;
	}
	.text {
		animation-name: gently-grow;
		animation-timing-function: linear;
		transform-origin: center;
	}
	@keyframes gently-grow {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(1.27, 1.27, 1.27);
		}
	}
</style>
