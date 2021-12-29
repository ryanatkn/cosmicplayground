<script lang="ts">
	import Clocks from './Clocks.svelte';
	import {getClock} from '$lib/app/clockStore';

	const clock = getClock();
</script>

<!-- TODO do we want `clock` to be pulled by `Clocks` from context? or keep it a prop? -->
<Clocks {clock} />
