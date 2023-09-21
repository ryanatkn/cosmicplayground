<script lang="ts">
	import {getClock} from '@ryanatkn/dealt';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	const clock = getClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 2}
	width={162}
	height={75}
	hzItems={[3, 4]}
	lowestHzItemCount={1}
/>
