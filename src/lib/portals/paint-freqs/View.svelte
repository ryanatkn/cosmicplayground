<script lang="ts">
	import PaintFreqs from './PaintFreqs.svelte';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
</script>

<PaintFreqs {width} {height} />
