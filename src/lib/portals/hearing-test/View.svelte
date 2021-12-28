<script lang="ts">
	import HearingTest from './HearingTest.svelte';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
</script>

<HearingTest {width} {height} />
