<script lang="ts">
	import InteractiveSurface from '$lib/app/InteractiveSurface.svelte';

	export let width: number;
	export let height: number;
	export let x;
	export let y;
	export let scale;
	export let zoomCamera; // TODO this API is wonky, maybe change to a camera store
	export let moveCamera;
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
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.transform-wrapper {
		transform-origin: center;
	}
</style>
