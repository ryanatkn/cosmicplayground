<script>
	import FreqSpectacle from './FreqSpectacle.svelte';
	import {useClock} from '../../app/clock.js';

	export const portal = undefined;

	const clock = useClock();
</script>

<FreqSpectacle
	elapsedTime={$clock.time}
	width={150}
	height={75}
	hzItems={[2, 3, 4]}
	lowestHzItemCount={1}
/>
