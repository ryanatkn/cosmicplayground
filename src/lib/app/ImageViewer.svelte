<script lang="ts">
	import InteractiveSurface from '$lib/app/InteractiveSurface.svelte';

	export let width: number;
	export let height: number;
	export let x: number;
	export let y: number;
	export let scale: number;
	export let zoomCamera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
	) => void; // TODO this API is wonky, maybe change to a camera store
	export let moveCamera: (dx: number, dy: number) => void;
	export let inputEnabled = true;
</script>

<InteractiveSurface {width} {height} {scale} {zoomCamera} {moveCamera} {inputEnabled}>
	<div class="image-viewer">
		<div
			class="transform-wrapper"
			style="transform: scale3d({scale}, {scale}, 1) translate3d({x}px, {y}px, 0); width: {width}px;
			height: {height}px;"
		>
			<slot />
		</div>
	</div>
</InteractiveSurface>

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
