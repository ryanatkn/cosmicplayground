<script>
	import GalaxyBg from './GalaxyBg.svelte';
	import {useClock} from '../../app/clockStore.js';

	export const portal = undefined;

	const clock = useClock();
</script>

<h1>starlit hammock</h1>
<GalaxyBg width={260} height={200} opacity={0.6} animationDuration="45s" running={$clock.running} />

<style>
	h1 {
		position: absolute;
		z-index: 1;
		color: var(--space_text_color);
	}
</style>
