<script>
	import Clocks from './Clocks.svelte';
	import {useClock} from '../../app/clock.js';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;

	const clock = useClock();
</script>

<!-- TODO do we want `clock` to be pulled by `Clocks` from context? or keep it a prop? -->
<Clocks {clock} />
