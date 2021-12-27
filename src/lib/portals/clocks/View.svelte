<script lang="ts">
	import Clocks from './Clocks.svelte';
	import {get_clock} from '$lib/app/clockStore.js';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;

	const clock = get_clock();
</script>

<!-- TODO do we want `clock` to be pulled by `Clocks` from context? or keep it a prop? -->
<Clocks {clock} />
