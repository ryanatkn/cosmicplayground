<script lang="ts">
	import Surface from '$lib/app/Surface.svelte';

	export let width: number;
	export let height: number;
	export let x: number;
	export let y: number;
	export let scale: number;
	export let zoom_camera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
	) => void; // TODO this API is wonky, maybe change to a camera store
	export let move_camera: (dx: number, dy: number) => void;
	export let input_enabled = true;
</script>

<Surface {width} {height} {scale} {zoom_camera} {move_camera} disabled={!input_enabled}>
	<div class="image-viewer">
		<div
			class="transform-wrapper"
			style="transform: scale3d({scale}, {scale}, 1) translate3d({x}px, {y}px, 0); width: {width}px;
			height: {height}px;"
		>
			<slot />
		</div>
	</div>
</Surface>

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
