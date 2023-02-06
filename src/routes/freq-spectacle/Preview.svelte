<script lang="ts">
	import {getClock} from '@feltcoop/dealt';

	import FreqSpectacle from './FreqSpectacle.svelte';

	const clock = getClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 2}
	width={162}
	height={75}
	hzItems={[3, 4]}
	lowestHzItemCount={1}
/>
