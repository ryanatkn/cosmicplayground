<script lang="ts">
	interface Props {
		width: number;
		height: number;
		imageUrl?: string;
		opacity?: number;
		animationDuration?: string;
		running?: boolean;
	}

	let {
		width,
		height,
		imageUrl = '/assets/space/galaxies.jpg',
		opacity = 0.2,
		animationDuration = '360s',
		running = true
	}: Props = $props();

	// TODO get from loaded image
	const imageWidth = 2560;
	const imageHeight = 1440;
	const imageAspectRatio = imageWidth / imageHeight;

	// Make sure the bg covers the container and seamlessly scrolls
	// regardless of its dimensions and aspect ratio.
	let useWidthDimension = $derived(width / imageAspectRatio > height);
	let bgWidth = $derived(2 * (useWidthDimension ? width : height * imageAspectRatio));
	let bgHeight = $derived(2 * (useWidthDimension ? width / imageAspectRatio : height));
</script>

<div
	class="galaxy-bg"
	style="width: {width}px; height: {height}px; opacity: {opacity};"
	class:paused={!running}
>
	<div
		class="earth_thumbnail_bg"
		style="width: {bgWidth}px; height: {bgHeight}px; background-image: url({imageUrl});
		animation-duration: {animationDuration};"
	></div>
</div>

<style>
	.galaxy-bg {
		overflow: hidden;
	}
	.earth_thumbnail_bg {
		background-size: 50%;
		background-repeat: repeat;
		animation-name: scroll-bg;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.paused .earth_thumbnail_bg {
		animation-play-state: paused;
	}
	@keyframes scroll-bg {
		0% {
			transform: translate3d(-50%, 0, 0);
		}
		100% {
			transform: translate3d(0, -50%, 0);
		}
	}
</style>
