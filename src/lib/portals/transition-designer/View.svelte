<script lang="ts">
	import TransitionDesigner from './TransitionDesigner.svelte';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
	width;
	height;
</script>

<TransitionDesigner />
