<script>
	// TODO make this modular - is currently hardcoded for a particular image name and size

	export let running = true;
	$: animation = running ? '' : 'animation: none;';
</script>

<div class="wrapper w-100 h-100 absolute overflow-hidden">
	<div class="bg" style={animation} />
</div>

<style>
	.wrapper {
		z-index: 0;
		opacity: 0.2;
	}
	.bg {
		width: 7680px;
		height: 4320px;
		background-image: url('assets/space/galaxies.jpg');
		background-repeat: repeat;
		animation: scroll-bg 360s linear infinite;
	}

	@keyframes scroll-bg {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-2560px, -1440px, 0);
		}
	}
</style>
