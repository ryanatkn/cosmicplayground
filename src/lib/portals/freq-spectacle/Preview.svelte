<script lang="ts">
	import FreqSpectacle from './FreqSpectacle.svelte';
	import {get_clock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;

	portal;

	const clock = get_clock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time}
	width={150}
	height={75}
	hzItems={[2, 3, 4]}
	lowestHzItemCount={1}
/>
