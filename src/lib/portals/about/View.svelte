<script lang="ts">
	import {type PortalData} from '$lib/portals/portal';
	import About from './About.svelte';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
	width;
	height;
</script>

<About />
