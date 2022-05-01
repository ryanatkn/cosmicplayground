<script lang="ts">
	import FreqSpeeds from './FreqSpeeds.svelte';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();
</script>

<FreqSpeeds elapsedTime={$clock.time} width={300} height={61} hzItems={[3]} lowestHzItemCount={2} />
<FreqSpeeds
	elapsedTime={$clock.time}
	width={300}
	height={61}
	hzItems={[3]}
	lowestHzItemCount={2}
	style="transform: rotate(180deg);"
/>
