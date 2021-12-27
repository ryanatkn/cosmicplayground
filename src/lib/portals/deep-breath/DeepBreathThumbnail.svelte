<script lang="ts">
	import EarthThumbnail from '../../app/EarthThumbnail.svelte';
	import {get_clock} from '../../app/clockStore.js';

	export let earthWidth = 600;
	export let label = 'proceed';
	export let onClick = null;

	const clock = get_clock();
</script>

<!-- TODO this isn't always a button so we don't use the button element,
but it doesn't seem quite right - is there a better pattern for a conditional parent?
I think there are some open Svelte issues about this. (like programmatic HTML tags) -->
<div
	class="deep-breath-thumbnail"
	style="width: {earthWidth}px; height: {earthWidth / 2}px;"
	role={onClick ? 'button' : undefined}
	aria-label={onClick ? label : undefined}
	tabindex={onClick ? '0' : undefined}
	on:click={onClick}
	class:buttonish={onClick}
>
	<div class="thumbnail-animation-wrapper">
		<EarthThumbnail
			width={earthWidth}
			height={earthWidth / 2}
			animationDuration="45s"
			running={$clock.running}
		/>
	</div>
	<div class="thumbnail-text">deep breath</div>
</div>

<style>
	.deep-breath-thumbnail {
		position: relative;
		cursor: default;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}
	.deep-breath-thumbnail:focus {
		/* TODO hack, see global `button:focus` style for more in main.css */
		outline: none;
	}
	.thumbnail-text {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		font-size: 84px;
		font-weight: 900;
		padding-bottom: 15px;
		white-space: nowrap;
		color: var(--ocean_color);
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}
	.thumbnail-animation-wrapper {
		border-radius: 50%;
		overflow: hidden;
		animation: breathing-earth 6s ease-in-out infinite alternate;
	}
	:global(.paused) .thumbnail-animation-wrapper {
		animation-play-state: paused;
	}

	.buttonish {
		transform: var(--clickable_transform_sm);
		transition: var(--clickable_transition);
	}
	.buttonish:hover {
		transform: var(--clickable_transform_sm__hover);
	}
	.buttonish:active {
		transform: var(--clickable_transform_sm__active);
	}

	@keyframes breathing-earth {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(0.92, 0.7, 1);
		}
	}
</style>
