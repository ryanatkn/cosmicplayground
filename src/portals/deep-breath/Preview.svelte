<script>
	import EarthThumbnail from '../../app/EarthThumbnail.svelte';
	import {useClock} from '../../app/clock.js';

	export const portal = undefined;

	const clock = useClock();
</script>

<!-- TODO handle color -->
<EarthThumbnail
	width={320}
	height={160}
	animationDuration="45s"
	running={$clock.running}
	text="deep breath"
/>
