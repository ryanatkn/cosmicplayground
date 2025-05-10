<script lang="ts">
	import Surface2 from '$lib/Surface2.svelte';

	interface Props {
		width: number;
		height: number;
		x: number;
		y: number;
		scale: number;
		zoom_camera: (direction: number, pivot_x: number, pivot_y: number) => void; // TODO this API is wonky, maybe change to a camera store
		move_camera: (dx: number, dy: number) => void;
		input_enabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		width,
		height,
		x,
		y,
		scale,
		zoom_camera,
		move_camera,
		input_enabled = true,
		children,
	}: Props = $props();
</script>

<Surface2 {width} {height} {scale} zoom={zoom_camera} pan={move_camera} disabled={!input_enabled}>
	<div class="image-viewer">
		<div
			class="transform-wrapper"
			style="transform: scale3d({scale}, {scale}, 1) translate3d({x}px, {y}px, 0); width: {width}px;
			height: {height}px;"
		>
			{@render children?.()}
		</div>
	</div>
</Surface2>

<style>
	.image-viewer {
		pointer-events: none;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.transform-wrapper {
		transform-origin: center;
	}
</style>
