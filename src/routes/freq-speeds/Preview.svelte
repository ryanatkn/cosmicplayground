<script lang="ts">
	import {getClock} from '@feltcoop/dealt';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';

	const clock = getClock();
</script>

<FreqSpeeds elapsedTime={$clock.time} width={162} height={61} hzItems={[3]} lowestHzItemCount={2} />
<FreqSpeeds
	elapsedTime={$clock.time}
	width={162}
	height={61}
	hzItems={[3]}
	lowestHzItemCount={2}
	style="transform: rotate(180deg);"
/>
