<script lang="ts">
	import {getClock} from '@feltcoop/dealt';
	import {swallow} from '@feltjs/util/dom.js';
	import {blur, slide} from 'svelte/transition';

	// TODO has some copypasta, needs refactoring

	export let tour_text: string[];
	export let transition_in_duration = 410;
	export let transition_out_duration = 870;

	// TODO better visual effect? typewriter?

	// transition vars
	const blur_amount = 99;

	const clock = getClock();
	const click = (e: MouseEvent): void => {
		if (e.target instanceof HTMLAnchorElement) {
			swallow(e);
			clock.pause();
			window.open(e.target.href, '_blank');
		}
	};
	const keydown = (e: KeyboardEvent): void => {
		if (e.target instanceof HTMLAnchorElement && (e.key === ' ' || e.key === 'Enter')) {
			swallow(e);
			clock.pause();
			window.open(e.target.href, '_blank');
		}
	};
</script>

<div
	class="tour-text markup"
	transition:blur|local={{duration: transition_out_duration, amount: blur_amount}}
>
	{#each tour_text as text (text)}
		<div class="text" in:slide|local={{duration: transition_in_duration}}>
			<div
				in:blur|local={{duration: transition_in_duration, amount: blur_amount}}
				on:click|capture={click}
				on:keydown|capture={keydown}
			>
				{@html text}
			</div>
		</div>
	{/each}
</div>

<style>
	.tour-text {
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
	.text,
	.text :global(a) {
		color: rgba(255, 255, 255, 0.88);
		text-shadow: var(--text_shadow_sm);
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
