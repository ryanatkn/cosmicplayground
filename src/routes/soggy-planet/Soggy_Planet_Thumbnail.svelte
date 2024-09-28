<script lang="ts">
	import {clock_context} from '$lib/clock.js';

	import EarthThumbnail from '$lib/EarthThumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$routes/soggy-planet/constants.js';

	export let earthWidth = THUMBNAIL_WIDTH_DEFAULT;
	export let label = 'proceed';
	export let on_click: ((e: MouseEvent) => void) | null = null;
	export let showName = true;

	const clock = clock_context.get();

	$: textScale = earthWidth / THUMBNAIL_WIDTH_DEFAULT;
</script>

<!-- TODO this fake sphere is unsettling... -->

<!-- TODO this isn't always a button so we don't use the button element,
but it doesn't seem quite right - is there a better pattern for a conditional parent?
I think there are some open Svelte issues about this. (like programmatic HTML tags) -->

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="soggy-planet-thumbnail"
	style:width="{earthWidth / 2}px"
	style:height="{earthWidth / 2}px;"
	role={on_click ? 'button' : undefined}
	aria-label={on_click ? label : undefined}
	tabindex={on_click ? 0 : undefined}
	onclick={on_click}
	class:buttonish={on_click}
>
	<div class="thumbnail-animation-wrapper">
		<EarthThumbnail
			width={earthWidth}
			height={earthWidth / 2}
			animationDuration="45s"
			running={$clock.running}
			image2Url="/assets/earth/lights.png"
		/>
	</div>
	{#if showName}
		<div class="thumbnail-text" style="transform: scale3d({textScale}, {textScale}, {textScale})">
			soggy planet
		</div>
	{/if}
</div>

<style>
	.soggy-planet-thumbnail {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}
	.soggy-planet-thumbnail:focus {
		/* TODO hack, see global `button:focus` style for more in main.css */
		outline: none;
	}
	.thumbnail-text {
		position: absolute;
		left: 0;
		bottom: -100px;
		width: 100%;
		font-size: 84px;
		font-weight: 900;
		white-space: nowrap;
		color: var(--ocean_color);
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-user-select: none;
		user-select: none;
	}
	@media (max-width: 600px) {
		.thumbnail-text {
			font-size: 64px;
		}
	}
	@media (max-width: 450px) {
		.thumbnail-text {
			font-size: 48px;
		}
	}
	.thumbnail-animation-wrapper {
		border-radius: 50%;
		overflow: hidden;
		animation: sogging-earth 12s ease-in-out infinite alternate;
	}
	/* TODO animation state var */
	:global(.paused) .thumbnail-animation-wrapper {
		animation-play-state: paused;
	}

	@keyframes sogging-earth {
		0% {
			transform: scale3d(1, 1, 1) rotate(calc(var(--earth_wobble) / -2));
		}
		100% {
			transform: scale3d(1.07, 1.07, 1.07) rotate(calc(var(--earth_wobble) / 2));
		}
	}
</style>
