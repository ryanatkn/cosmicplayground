<script lang="ts">
	import {clock_context} from '$lib/clock.js';

	import EarthThumbnail from '$lib/EarthThumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$routes/deep-breath/constants.js';

	interface Props {
		earthWidth: number;
		label: string;
		on_click: ((e: MouseEvent) => void) | null;
	}

	const {
		earthWidth = THUMBNAIL_WIDTH_DEFAULT,
		label = 'proceed',
		on_click = null,
	}: Props = $props();

	const clock = clock_context.get();

	const textScale = $derived(earthWidth / THUMBNAIL_WIDTH_DEFAULT);
</script>

<!-- TODO this isn't always a button so we don't use the button element,
but it doesn't seem quite right - is there a better pattern for a conditional parent?
I think there are some open Svelte issues about this. (like programmatic HTML tags) -->

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="deep-breath-thumbnail"
	style:width="{earthWidth}px"
	style:height="{earthWidth / 2}px"
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
		/>
	</div>
	<div class="thumbnail-text" style:transform="scale3d({textScale}, {textScale}, {textScale})">
		deep breath
	</div>
</div>

<style>
	.deep-breath-thumbnail {
		position: relative;
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
		-webkit-user-select: none;
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

	@keyframes breathing-earth {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(0.92, 0.7, 1);
		}
	}
</style>
