<script lang="ts">
	import EarthThumbnail from '$lib/app/EarthThumbnail.svelte';
	import {getClock} from '$lib/app/clock';

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
