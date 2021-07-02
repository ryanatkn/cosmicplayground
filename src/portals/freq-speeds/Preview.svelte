<script>
	import FreqSpeeds from './FreqSpeeds.svelte';
	import {get_clock} from '../../app/clockStore.js';

	export const portal = undefined;

	const clock = get_clock();
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
