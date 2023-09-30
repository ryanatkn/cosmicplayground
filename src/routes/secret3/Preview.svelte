<script lang="ts">
	import {get_clock} from '$lib/dealt/flat/clock.js';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	const clock = get_clock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 4}
	width={100}
	height={10}
	hzItems={[5]}
	lowestHzItemCount={1}
/>
