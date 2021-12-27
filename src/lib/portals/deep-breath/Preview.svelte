<script>
	import EarthThumbnail from '../../app/EarthThumbnail.svelte';
	import {get_clock} from '../../app/clockStore.js';

	export const portal = undefined;

	const clock = get_clock();
</script>

<!-- TODO handle color -->
<EarthThumbnail
	width={320}
	height={160}
	animationDuration="90s"
	running={$clock.running}
	text="deep breath"
/>
