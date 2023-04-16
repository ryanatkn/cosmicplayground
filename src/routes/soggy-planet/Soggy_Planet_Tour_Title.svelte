<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {blur} from 'svelte/transition';

	export let hide: () => void;
	export let transition_duration: number;
	export let pause_duration: number;
	export let max_delay: number;

	// transition vars
	const blur_amount = 99;

	$: animation_duration = transition_duration * 2 + pause_duration;
	$: text_style = `animation-duration: ${animation_duration}ms;`;

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
		<div in:blur={{duration: transition_duration, amount: blur_amount}}>deep</div>
	</div>
	<div class="text" style={text_style}>
		<div in:blur={{duration: transition_duration, amount: blur_amount, delay: max_delay}}>
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
