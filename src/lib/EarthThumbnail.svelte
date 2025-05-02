<script lang="ts">
	interface Props {
		width: number;
		height: number;
		imageUrl?: string;
		image2Url?: string | undefined;
		opacity?: number;
		animationDuration?: string;
		fontSize?: number;
		text?: string | null;
		running?: boolean;
	}

	let {
		width,
		height,
		imageUrl = '/assets/earth/seas.png',
		image2Url = undefined,
		opacity = 1.0,
		animationDuration = '360s',
		fontSize = 48,
		text = null,
		running = true
	}: Props = $props();

	// TODO get from loaded image
	const imageWidth = 300;
	const imageHeight = 150;
	const imageAspectRatio = imageWidth / imageHeight;

	// Make sure the bg covers the container and seamlessly scrolls
	// regardless of its dimensions and aspect ratio.
	let useWidthDimension = $derived(width / imageAspectRatio > height);
	let bgWidth = $derived(2 * (useWidthDimension ? width : height * imageAspectRatio));
	let bgHeight = $derived(2 * (useWidthDimension ? width / imageAspectRatio : height));

	// TODO support customizing this?
	const bgSizePct = 0.5;
	const bgSizeStr = bgSizePct * 100 + '%';
</script>

<div
	class="earth-thumbnail"
	class:paused={!running}
	style="width: {width}px; height: {height}px; opacity: {opacity};"
>
	<div
		class="earth_thumbnail_bg"
		style="width: {bgWidth}px; height: {bgHeight}px; background-image: url({imageUrl});
		background-size: {bgSizeStr}; animation-duration: {animationDuration};"
	>
		{#if image2Url}
			<div
				class="bg2"
				style="width: {bgWidth}px; height: {bgHeight}px; background-image: url({image2Url});
		background-size: {bgSizeStr};"
			></div>
		{/if}
	</div>
	{#if text}
		<div class="text" style="font-size: {fontSize}px;">{text}</div>
	{/if}
</div>

<style>
	.earth-thumbnail {
		position: relative;
		overflow: hidden;
		-webkit-user-select: none;
		user-select: none;
	}
	.text {
		font-weight: 900;
		white-space: nowrap;
		color: var(--ocean_color); /* not using text color so it matches the base water color */
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.earth_thumbnail_bg {
		background-repeat: repeat;
		background-position-x: 60%;
		animation: scroll-bg linear infinite;
	}
	.paused .earth_thumbnail_bg,
	.paused .bg2 {
		animation-play-state: paused;
	}
	.bg2 {
		background-repeat: repeat;
		background-position-x: 60%;
		animation: pulse-lights 6s linear infinite alternate;
	}

	@keyframes scroll-bg {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-50%, 0, 0);
		}
	}

	@keyframes pulse-lights {
		0% {
			opacity: 0.1;
		}
		100% {
			opacity: 1;
		}
	}
</style>
