<script lang="ts">
	import FreqSpeeds from '$lib/portals/freq-speeds/FreqSpeeds.svelte';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();
</script>

<FreqSpeeds
	elapsedTime={$clock.time / 4}
	width={100}
	height={30}
	hzItems={[3]}
	lowestHzItemCount={1}
/>
