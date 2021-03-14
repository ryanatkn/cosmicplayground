<script>
	import EarthThumbnail from '../../app/EarthThumbnail.svelte';
	import {useClock} from '../../app/clockStore.js';

	export const portal = undefined;

	const clock = useClock();
</script>

<!-- TODO handle color -->
<EarthThumbnail
	width={320}
	height={160}
	animationDuration="90s"
	running={$clock.running}
	text="deep breath"
/>
