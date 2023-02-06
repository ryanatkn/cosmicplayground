<script lang="ts">
	import {getClock} from '@feltcoop/dealt';

	import EarthThumbnail from '$lib/app/EarthThumbnail.svelte';

	const clock = getClock();
</script>

<!-- TODO handle color -->
<EarthThumbnail
	width={320}
	height={160}
	animationDuration="90s"
	running={$clock.running}
	text="soggy planet"
/>
