<script lang="ts">
	import {type PortalData} from '$lib/portals/portal';
	import Clocks from './Clocks.svelte';
	import {getClock} from '$lib/app/clockStore';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
	width;
	height;

	const clock = getClock();
</script>

<!-- TODO do we want `clock` to be pulled by `Clocks` from context? or keep it a prop? -->
<Clocks {clock} />
