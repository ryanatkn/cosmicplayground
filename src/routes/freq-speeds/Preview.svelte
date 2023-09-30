<script lang="ts">
	import {get_clock} from '$lib/dealt/flat/clock.js';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';

	const clock = get_clock();
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
