<script>
	export let width;
	export let height;
	export let imageUrl = '/assets/earth/seas.png';
	export let opacity = 1.0;
	export let animationDuration = '360s';
	export let fontSize = 48;
	export let text;
	export let styles = '';
	export let running = true;

	// TODO get from loaded image
	let imageWidth = 300;
	let imageHeight = 150;
	$: imageAspectRatio = imageWidth / imageHeight;

	// Make sure the bg covers the container and seamlessly scrolls
	// regardless of its dimensions and aspect ratio.
	$: useWidthDimension = width / imageAspectRatio > height;
	$: bgWidth = 2 * (useWidthDimension ? width : height * imageAspectRatio);
	$: bgHeight = 2 * (useWidthDimension ? width / imageAspectRatio : height);

	// TODO support customizing this?
	const bgSizePct = 0.5;
	$: bgSizeStr = bgSizePct * 100 + '%';

	$: animation = running ? '' : 'animation: none;';
</script>

<div
	class="earth-thumbnail"
	style="width: {width}px; height: {height}px; opacity: {opacity}; {styles}"
>
	<div
		class="bg"
		class:grayscale={!running}
		style="{animation} width: {bgWidth}px; height: {bgHeight}px; background-image: url({imageUrl});
		background-size: {bgSizeStr}; animation-duration: {animationDuration};"
	/>
	{#if text}
		<div class="text" style="font-size: {fontSize}px;">{text}</div>
	{/if}
</div>

<style>
	.earth-thumbnail {
		position: relative;
		overflow: hidden;
	}
	.text {
		font-weight: 900;
		white-space: nowrap;
		color: var(--ocean_color);
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bg {
		background-repeat: repeat;
		animation-name: scroll-bg;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		background-position-x: 60%;
	}

	@keyframes scroll-bg {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-50%, 0, 0);
		}
	}
</style>
