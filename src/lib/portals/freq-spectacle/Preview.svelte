<script lang="ts">
	import FreqSpectacle from './FreqSpectacle.svelte';
	import {get_clock} from '$lib/app/clockStore.js';

	export const portal = undefined;

	const clock = get_clock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time}
	width={150}
	height={75}
	hzItems={[2, 3, 4]}
	lowestHzItemCount={1}
/>
