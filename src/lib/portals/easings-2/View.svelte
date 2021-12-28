<script lang="ts">
	import EasingAudViz from './EasingAudViz.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
	width;
	height;

	const clock = getClock();
</script>

<EasingAudViz {clock} />
