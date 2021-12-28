<script lang="ts">
	import UnderConstruction from './UnderConstruction.svelte';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
</script>

<UnderConstruction {width} {height} />
