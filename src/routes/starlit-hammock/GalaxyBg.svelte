<script lang="ts">
	export let width: number;
	export let height: number;
	export let imageUrl = '/assets/space/galaxies.jpg';
	export let opacity = 0.2;
	export let animationDuration = '360s';
	export let running = true;

	// TODO get from loaded image
	const imageWidth = 2560;
	const imageHeight = 1440;
	const imageAspectRatio = imageWidth / imageHeight;

	// Make sure the bg covers the container and seamlessly scrolls
	// regardless of its dimensions and aspect ratio.
	$: useWidthDimension = width / imageAspectRatio > height;
	$: bgWidth = 2 * (useWidthDimension ? width : height * imageAspectRatio);
	$: bgHeight = 2 * (useWidthDimension ? width / imageAspectRatio : height);
</script>

<div
	class="galaxy-bg"
	style="width: {width}px; height: {height}px; opacity: {opacity};"
	class:paused={!running}
>
	<div
		class="bg"
		style="width: {bgWidth}px; height: {bgHeight}px; background-image: url({imageUrl});
		animation-duration: {animationDuration};"
	/>
</div>

<style>
	.galaxy-bg {
		overflow: hidden;
	}
	.bg {
		background-size: 50%;
		background-repeat: repeat;
		animation-name: scroll-bg;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.paused .bg {
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
