<script lang="ts">
	import Surface2 from '$lib/Surface2.svelte';

	export let width: number;
	export let height: number;
	export let x: number;
	export let y: number;
	export let scale: number;
	export let zoom_camera: (direction: number, pivot_x: number, pivot_y: number) => void; // TODO this API is wonky, maybe change to a camera store
	export let move_camera: (dx: number, dy: number) => void;
	export let input_enabled = true;
</script>

<Surface2 {width} {height} {scale} zoom={zoom_camera} pan={move_camera} disabled={!input_enabled}>
	<div class="image-viewer">
		<div
			class="transform-wrapper"
			style="transform: scale3d({scale}, {scale}, 1) translate3d({x}px, {y}px, 0); width: {width}px;
			height: {height}px;"
		>
			<slot />
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
