<script lang="ts">
	import DeepBreath from './DeepBreath.svelte';
	import {get_clock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;
	// TODO alternate API?
	// const {portalWidth, portalHeight} = portalStores();
	// const {width, height} = portalStores();
	// const {width, height} = usePortal();

	portal;

	const clock = get_clock();
</script>

<DeepBreath {clock} {width} {height} />
