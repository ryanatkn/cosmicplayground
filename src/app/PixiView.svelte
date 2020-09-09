<script>
	import * as PIXI from 'pixi.js';
	import {onDestroy, onMount} from 'svelte';

	export let pixi;
	export let width;
	export let height;

	$: if (width !== pixi.renderer.width || height !== pixi.renderer.height) {
		pixi.renderer.resize(width, height);
	}

	$: mountView(pixi);

	let el;
	const mountView = (pixi) => {
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

	onMount(() => mountView(pixi));
	onDestroy(() => el.removeChild(pixi.view));
</script>

<div style="width: {width}px; height: {height}px;" bind:this={el} />
