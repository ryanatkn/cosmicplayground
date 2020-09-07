<script>
	import DeepBreath from './DeepBreath.svelte';
	import {useClock} from '../../app/clock.js';

	export const portal = undefined;
	export let width;
	export let height;

	const clock = useClock();
</script>

<div class="view">
	<DeepBreath {clock} {width} {height} />
</div>

<style>
	:global(.idle) .view {
		cursor: none;
	}
</style>
