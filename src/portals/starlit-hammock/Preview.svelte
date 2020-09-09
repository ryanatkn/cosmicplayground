<script>
	import GalaxyBg from './GalaxyBg.svelte';
	import {useClock} from '../../app/clockStore.js';

	export const portal = undefined;

	const clock = useClock();
</script>

<h2>starlit hammock</h2>
<GalaxyBg width={260} height={200} opacity={0.6} animationDuration="45s" running={$clock.running} />

<style>
	h2 {
		position: absolute;
		z-index: 1;
	}
</style>
