<script lang="ts">
	import { run } from 'svelte/legacy';

	import {onDestroy, onMount} from 'svelte';

	import type {PixiApp} from '$lib/pixi.js';

	// TODO detect max texture and disable images that don't work
	// `const gl = document.createElement('canvas').getContext('webgl');`
	

	interface Props {
		// `console.log(gl.getParameter(gl.MAX_TEXTURE_SIZE))`
		pixi: PixiApp;
		width: number;
		height: number;
	}

	let { pixi, width, height }: Props = $props();

	run(() => {
		if (width !== pixi.app.renderer.width || height !== pixi.app.renderer.height) {
			pixi.app.renderer.resize(width, height);
		}
	});

	let el: HTMLElement = $state();
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

	run(() => {
		mountView(pixi);
	});
	onMount(() => mountView(pixi));
	onDestroy(() => el.removeChild(pixi.app.view as any));
</script>

<div style="width: {width}px; height: {height}px;" bind:this={el}></div>
