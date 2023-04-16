<script lang="ts">
	import {blur, slide} from 'svelte/transition';

	// TODO has some copypasta, needs refactoring

	export let event_text: string[];
	export let transition_in_duration = 170;
	export let transition_out_duration = 170;

	// TODO better visual effect? typewriter?

	// transition vars
	const blur_amount = 99;
</script>

<div
	class="event-text markup"
	transition:blur|local={{duration: transition_out_duration, amount: blur_amount}}
>
	{#each event_text as text (text)}
		<div class="text" in:slide|local>
			<div in:blur|local={{duration: transition_in_duration, amount: blur_amount}}>
				{text}
			</div>
		</div>
	{/each}
</div>

<style>
	.event-text {
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
	.text {
		animation-name: gently-grow;
		animation-timing-function: linear;
		animation-duration: 20s;
		animation-fill-mode: forwards;
		transform-origin: center;
	}
	.text:nth-child(2) {
		animation-name: gently-shrink;
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
