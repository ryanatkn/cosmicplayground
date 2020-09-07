<script>
	import UnderConstruction from './UnderConstruction.svelte';
	import {useClock} from '../../app/clock.js';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;

	const clock = useClock();
</script>

<UnderConstruction running={$clock.running} />
