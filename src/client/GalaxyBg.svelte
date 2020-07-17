<script>
	export let width;
	export let height;
	export let imageUrl = '/assets/space/galaxies.jpg';
	export let opacity = 0.2;
	export let animationDuration = '360s';

	// TODO get from loaded image
	let imageWidth = 2560;
	let imageHeight = 1440;
	$: imageAspectRatio = imageWidth / imageHeight;

	// Make sure the bg covers the container and seamlessly scrolls
	// regardless of its dimensions and aspect ratio.
	$: useWidthDimension = width / imageAspectRatio > height;
	$: bgWidth = 2 * (useWidthDimension ? width : height * imageAspectRatio);
	$: bgHeight = 2 * (useWidthDimension ? width / imageAspectRatio : height);

	// TODO support customizing this?
	const bgSizePct = 0.5;
	$: bgSizeStr = bgSizePct * 100 + '%';

	export let running = true;
	$: animation = running ? '' : 'animation: none;';
</script>

<div class="w-100 h-100 absolute overflow-hidden z-0" style="opacity: {opacity};">
	<div
		class="bg"
		style="{animation} width: {bgWidth}px; height: {bgHeight}px; background-image: url({imageUrl});
		background-size: {bgSizeStr}; animation-duration: {animationDuration};"
	/>
</div>

<style>
	.bg {
		background-repeat: repeat;
		animation-name: scroll-bg;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes scroll-bg {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-50%, -50%, 0);
		}
	}
</style>
