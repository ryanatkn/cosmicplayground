<script lang="ts">
	import FreqSpectacle from './FreqSpectacle.svelte';
	import {getClock} from '$lib/app/clockStore';
	import type {PortalData} from '$lib/portals/portal';

	export const portal: PortalData = undefined as any;

	const clock = getClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time}
	width={150}
	height={75}
	hzItems={[2, 3, 4]}
	lowestHzItemCount={1}
/>
