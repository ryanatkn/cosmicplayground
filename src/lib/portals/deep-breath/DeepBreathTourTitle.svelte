<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {blur} from 'svelte/transition';

	export let hide: () => void;
	export let transitionDuration: number;
	export let pauseDuration: number;
	export let maxDelay: number;

	// transition vars
	const blurAmount = 99;

	$: animationDuration = transitionDuration * 2 + pauseDuration;
	$: textStyle = `animation-duration: ${animationDuration}ms;`;

	let timeout: any;
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
