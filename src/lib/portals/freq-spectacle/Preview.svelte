<script lang="ts">
	import FreqSpectacle from './FreqSpectacle.svelte';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time}
	width={162}
	height={75}
	hzItems={[2, 3, 4]}
	lowestHzItemCount={1}
/>
