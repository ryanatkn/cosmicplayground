<script lang="ts">
	import {onDestroy, onMount} from 'svelte';

	import type {PixiApp} from '$lib/pixi.js';

	// TODO detect max texture and disable images that don't work
	// `const gl = document.createElement('canvas').getContext('webgl');`
	// `console.log(gl.getParameter(gl.MAX_TEXTURE_SIZE))`

	export let pixi: PixiApp;
	export let width: number;
	export let height: number;

	$: if (width !== pixi.app.renderer.width || height !== pixi.app.renderer.height) {
		pixi.app.renderer.resize(width, height);
	}

	let el: HTMLElement;
	const mountView = (pixi: PixiApp) => {
		if (!el) return; // not ready
		const {firstChild} = el;
		if (firstChild) {
			if (pixi.app.view === (firstChild as any)) return; // didn't change
			if (el.childNodes.length > 1) {
				throw Error(`PixiView has ${el.childNodes.length} child nodes! Expected 0 or 1.`);
			}
			el.removeChild(firstChild);
		}
		el.appendChild(pixi.app.view as any);
	};

	$: mountView(pixi);
	onMount(() => mountView(pixi));
	onDestroy(() => el.removeChild(pixi.app.view as any));
</script>

<div style="width: {width}px; height: {height}px;" bind:this={el}></div>
