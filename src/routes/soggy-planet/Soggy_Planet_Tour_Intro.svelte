<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {blur} from 'svelte/transition';

	// Some of these props are weird
	// but the parent needs to know how long the total duration is
	// before the component gets mounted. (unless we refactor things in a weird way)
	// We could change this and `DeepBreathTourTitle` to use a common component,
	// but I might want to customize behavior further,
	// and I'm doubting the reusability mileage of that much abstraction.

	export let hide: () => void;
	export let total_duration: number;
	export let transition_in_duration: number;
	export let transition_out_duration: number;
	export let max_delay: number;

	// TODO better visual effect? typewriter?

	// transition vars
	const text2_delay = Math.min(max_delay, 2000);
	const blur_amount = 99;

	$: text_style = `animation-duration: ${total_duration}ms;`;

	let timeout: any;
	onMount(() => {
		timeout = setTimeout(() => hide(), total_duration - transition_out_duration);
	});
	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<div class="tour-title" out:blur|local={{duration: transition_out_duration, amount: blur_amount}}>
	<div class="text" style={text_style}>
		<div in:blur={{duration: transition_in_duration, amount: blur_amount}}>
			for tens of thousands of years, humanity has thrived along <span class="earth-text"
				>coastlines</span
			>
			and <span class="earth-text">river valleys</span>
		</div>
	</div>
	<div class="text" style={text_style}>
		<div in:blur={{duration: transition_in_duration, amount: blur_amount, delay: text2_delay}}>
			around 19-20,000 years ago, at the end of the <a
				href="https://wikipedia.org/wiki/Last_Glacial_Maximum">Last Glacial Maximum</a
			>, global sea levels looked rougly like this
		</div>
	</div>
	<div class="text final-text" style={text_style}>
		<div in:blur={{duration: transition_in_duration, amount: blur_amount, delay: max_delay}}>
			many places were curiously drier, and myth found a welcome home in the minds of many
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
		font-size: 64px;
		line-height: 1.5;
		font-weight: 300;
		padding-bottom: 40px; /* center the text slightly better */
		overflow: hidden; /* lazy hack for small screens, assuming 1080p or larger */
		user-select: none;
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
