<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {blur} from 'svelte/transition';

	interface Props {
		hide: () => void;
		transition_duration: number;
		pause_duration: number;
		max_delay: number;
	}

	let {
		hide,
		transition_duration,
		pause_duration,
		max_delay
	}: Props = $props();

	// transition vars
	const blur_amount = 99;

	let animation_duration = $derived(transition_duration * 2 + pause_duration);
	let text_style = $derived(`animation-duration: ${animation_duration}ms;`);

	let timeout: any;
	onMount(() => {
		timeout = setTimeout(() => hide(), transition_duration + max_delay + pause_duration);
	});
	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="tour-title" out:blur|local={{duration: transition_duration, amount: blur_amount}}>
	<div class="text" style={text_style}>
		<div in:blur|local={{duration: transition_duration, amount: blur_amount}}>soggy</div>
	</div>
	<div class="text" style={text_style}>
		<div in:blur|local={{duration: transition_duration, amount: blur_amount, delay: max_delay}}>
			planet
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
		--slide_target_x: -130px;
		--slide_target_y: -20px;
		animation-name: gently-grow-and-slide;
		animation-timing-function: linear;
		transform-origin: center;
	}
	.text:first-child {
		--slide_target_x: 130px;
		--slide_target_y: 20px;
	}
	@keyframes gently-grow-and-slide {
		0% {
			transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
		}
		100% {
			transform: scale3d(1.27, 1.27, 1.27)
				translate3d(var(--slide_target_x), var(--slide_target_y), 0);
		}
	}
</style>
