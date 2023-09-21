<script lang="ts">
	import {getClock} from '@feltcoop/dealt';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';

	const clock = getClock();
</script>

<FreqSpeeds
	elapsedTime={$clock.time / 4}
	width={100}
	height={30}
	hzItems={[3]}
	lowestHzItemCount={1}
/>
