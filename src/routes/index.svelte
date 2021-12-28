<script lang="ts">
	import HomeView from '$lib/portals/home/View.svelte';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;
</script>

<!-- TODO how to handle portals? -->

<!-- TODO width/height shouldn't be props -->

<HomeView {portal} {width} {height} />
