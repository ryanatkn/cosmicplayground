<script lang="ts">
	import {get_clock} from '$lib/clock.js';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';

	const clock = get_clock();
</script>

<FreqSpeeds
	elapsedTime={$clock.time / 4}
	width={100}
	height={30}
	hzItems={[3]}
	lowestHzItemCount={1}
/>
