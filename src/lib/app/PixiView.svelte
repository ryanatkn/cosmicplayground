<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {PixiApp} from '$lib/app/pixi';

	// TODO detect max texture and disable images that don't work
	// `const gl = document.createElement('canvas').getContext('webgl');`
	// `console.log(gl.getParameter(gl.MAX_TEXTURE_SIZE))`

	export let pixi: PixiApp;
	export let width: number;
	export let height: number;

	$: if (width !== pixi.renderer.width || height !== pixi.renderer.height) {
		pixi.renderer.resize(width, height);
	}

	let el: HTMLElement;
	const mountView = (pixi: PixiApp) => {
		if (!el) return; // not ready
		const {firstChild} = el;
		if (firstChild) {
			if (pixi.view === firstChild) return; // didn't change
			if (el.childNodes.length > 1) {
				throw Error(`PixiView has ${el.childNodes.length} child nodes! Expected 0 or 1.`);
			}
			el.removeChild(firstChild);
		}
		el.appendChild(pixi.view);
	};

	$: mountView(pixi);
	onMount(() => mountView(pixi));
	onDestroy(() => el.removeChild(pixi.view));
</script>

<div style="width: {width}px; height: {height}px;" bind:this={el} />
