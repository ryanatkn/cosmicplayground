<script lang="ts">
	import {clock_context} from '$lib/clock.js';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	const clock = clock_context.get();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 2}
	width={162}
	height={75}
	hzItems={[3, 4]}
	lowestHzItemCount={1}
/>
