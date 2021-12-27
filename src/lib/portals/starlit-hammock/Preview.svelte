<script lang="ts">
	import GalaxyBg from './GalaxyBg.svelte';
	import {get_clock} from '$lib/app/clockStore.js';

	export const portal = undefined;

	const clock = get_clock();
</script>

<h1>starlit hammock</h1>
<GalaxyBg
	width={260}
	height={200}
	opacity={0.6}
	animationDuration="180s"
	running={$clock.running}
/>

<style>
	h1 {
		position: absolute;
		z-index: 1;
		color: var(--space_text_color);
	}
</style>
