<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {blur} from 'svelte/transition';

	interface Props {
		hide: () => void;
		transitionDuration: number;
		pauseDuration: number;
		maxDelay: number;
	}

	let {
		hide,
		transitionDuration,
		pauseDuration,
		maxDelay
	}: Props = $props();

	// transition vars
	const blurAmount = 99;

	let animationDuration = $derived(transitionDuration * 2 + pauseDuration);
	let textStyle = $derived(`animation-duration: ${animationDuration}ms;`);

	let timeout: any;
	onMount(() => {
		timeout = setTimeout(() => hide(), transitionDuration + maxDelay + pauseDuration);
	});
	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="tour-title" out:blur|local={{duration: transitionDuration, amount: blurAmount}}>
	<div class="text" style={textStyle}>
		<div in:blur|local={{duration: transitionDuration, amount: blurAmount}}>deep</div>
	</div>
	<div class="text" style={textStyle}>
		<div in:blur|local={{duration: transitionDuration, amount: blurAmount, delay: maxDelay}}>
			breath
		</div>
	</div>
</div>

<style>
	.tour-title {
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
		-webkit-user-select: none;
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
