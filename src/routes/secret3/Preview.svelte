<script lang="ts">
	import FreqSpectacle from '../freq-spectacle/FreqSpectacle.svelte';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 4}
	width={100}
	height={10}
	hzItems={[5]}
	lowestHzItemCount={1}
/>
