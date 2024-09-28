<script lang="ts">
	import {clock_context} from '$lib/clock.js';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	const clock = clock_context.get();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 4}
	width={100}
	height={10}
	hzItems={[5]}
	lowestHzItemCount={1}
/>
