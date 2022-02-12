<script lang="ts">
	import FreqSpeeds from './FreqSpeeds.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export const portal: PortalData = undefined as any;

	const clock = getClock();
</script>

<FreqSpeeds elapsedTime={$clock.time} width={300} height={75} hzItems={[4]} lowestHzItemCount={2} />
<FreqSpeeds
	elapsedTime={$clock.time}
	width={300}
	height={75}
	hzItems={[4]}
	lowestHzItemCount={2}
	style="transform: rotate(180deg);"
/>
