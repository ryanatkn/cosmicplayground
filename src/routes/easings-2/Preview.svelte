<script lang="ts">
	import {lerp} from '@ryanatkn/belt/maths.js';

	let canvas: HTMLCanvasElement | null = null;
	$: canvas && drawCanvas(canvas);
	const canvasWidth = 240;
	const canvasHeight = 24;
	const mouthSize = 16;
	const tailSize = 10;
	const drawCanvas = (canvas: HTMLCanvasElement) => {
		// TODO can remove these temp vars after refactoring into a standalone component - names should be shortened
		const width = canvasWidth;
		const height = canvasHeight;
		if (canvas.width !== width) canvas.width = width;
		if (canvas.height !== height) canvas.height = height;
		const ctx = canvas.getContext('2d')!;
		const lineWidth = 2;
		const h = height - lineWidth * 2;
		ctx.clearRect(0, 0, width, height);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = 'hsla(220deg, 60%, 65%, 0.6)'; // could fade opacity in from the left
		ctx.moveTo(0, height / 2);
		for (let x = 1; x < width; x++) {
			const xDiv = lerp(8, 3.75, x / width);
			const y = (Math.sin(x / xDiv) * h) / 2 + h / 2 + lineWidth;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
	};
</script>

<div class="preview">
	<h2 class="m_0">easing function auralizations</h2>
	<div class="wrapper">
		<canvas bind:this={canvas} />
		<div
			class="mouth-wrapper"
			style="left: {-mouthSize / 2}px; top: {canvasHeight / 2 -
				mouthSize / 2}px; width: {mouthSize}px;
			height: {mouthSize}px;"
		>
			<div class="mouth" style="width: {mouthSize}px; height: {mouthSize}px;" />
			<div class="mouth" style="width: {mouthSize}px; height: {mouthSize}px;" />
			<div style="width: {mouthSize}px; height: {mouthSize}px; border-radius: 50%;" />
		</div>
		<div
			class="tail-wrapper"
			style="right: {-tailSize / 2}px; top: {8 +
				canvasHeight / 2 -
				tailSize / 2}px; width: {tailSize}px;
			height: {tailSize}px;"
		>
			<div class="tail" style="width: {tailSize}px; height: {tailSize}px;" />
			<div class="tail" style="width: {tailSize}px; height: {tailSize}px;" />
			<div style="width: {tailSize / 2}px; height: {tailSize / 2}px; border-radius: 50%;" />
		</div>
	</div>
</div>

<style>
	.preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--portal_padding);
	}
	.wrapper {
		position: relative;
		margin-top: 10px;
		animation: wrapper-warp 5s cubic-bezier(0.86, 0, 0.07, 1) infinite alternate;
	}
	:global(.paused) .wrapper {
		animation-play-state: paused;
	}
	@keyframes wrapper-warp {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(1.5, 1, 1);
		}
	}
	.mouth-wrapper {
		position: absolute;
		animation: dance 10s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
		transform-origin: middle middle;
	}
	:global(.paused) .mouth-wrapper {
		animation-play-state: paused;
	}
	.mouth {
		position: absolute;
		left: 0;
		top: 0;
		background-color: hsl(var(--color_b_5));
		animation: rotate-360 0.5s linear reverse infinite;
		transform-origin: middle middle;
	}
	.mouth:nth-child(2) {
		animation: rotate-360 0.5s linear infinite;
	}
	:global(.paused) .mouth {
		animation-play-state: paused;
	}
	.tail-wrapper {
		position: absolute;
		animation: dance 10s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
		transform-origin: middle middle;
	}
	:global(.paused) .tail-wrapper {
		animation-play-state: paused;
	}
	.tail {
		position: absolute;
		left: 0;
		top: 0;
		background-color: hsl(var(--color_b_5));
		animation: rotate-360 0.5s linear reverse infinite;
		transform-origin: middle middle;
	}
	.tail:nth-child(2) {
		animation: rotate-360 0.5s linear infinite;
	}
	:global(.paused) .tail {
		animation-play-state: paused;
	}
	@keyframes rotate-360 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes dance {
		0% {
			transform: scale3d(0.15, 0.15, 1) rotate(-45deg);
		}
		50% {
			transform: scale3d(0.5, 0.5, 1) rotate(225deg);
		}
		100% {
			transform: scale3d(0.15, 0.15, 1) rotate(450deg);
		}
	}
</style>
