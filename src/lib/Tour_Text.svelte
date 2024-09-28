<script lang="ts">
	import {clock_context} from '$lib/clock.js';
	import {get_dimensions} from '$lib/dimensions.js';
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {blur} from 'svelte/transition';

	const clock = clock_context.get();
	const dimensions = get_dimensions();

	// TODO has some copypasta, needs refactoring

	export let tour_text: string[];
	export let transition_in_duration = 600;
	export let transition_out_duration = 870;
	export let height_per_item = 90;

	$: height = height_per_item * tour_text.length;

	// TODO better visual effect? typewriter?

	// transition vars
	const blur_amount = 99;

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

<!-- the top offset is super hacky but w/e -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="tour-text"
	transition:blur|local={{duration: transition_out_duration, amount: blur_amount}}
	style:top="{$dimensions.height / 2 - 164}px"
	on:click|capture={click}
	on:keydown|capture={keydown}
>
	<div style:height="{height}px">
		<!-- hacky but `i` is expected to not change, avoids need for uniqueness -->
		{#each tour_text as text, i (i + text)}
			<div class="text" in:blur|local={{duration: transition_in_duration, amount: blur_amount}}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html text || '&nbsp;'}
			</div>
		{/each}
	</div>
</div>

<style>
	.tour-text {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		font-size: 64px;
		line-height: 1.5;
		font-weight: 300;
		padding-bottom: 40px; /* center the text slightly better */
		overflow: hidden; /* lazy hack for small screens, assuming 1080p or larger */
		-webkit-user-select: none;
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
