<script lang="ts">
	import {get_clock} from '@ryanatkn/dealt/clock.js';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	const clock = get_clock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time / 2}
	width={162}
	height={75}
	hzItems={[3, 4]}
	lowestHzItemCount={1}
/>
