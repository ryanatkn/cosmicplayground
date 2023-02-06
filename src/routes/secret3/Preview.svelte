<script lang="ts">
	import {getClock} from '@feltcoop/dealt';

	import FreqSpectacle from '../freq-spectacle/FreqSpectacle.svelte';

	const clock = getClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 4}
	width={100}
	height={10}
	hzItems={[5]}
	lowestHzItemCount={1}
/>
