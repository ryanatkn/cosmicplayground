<script lang="ts">
	import {get_clock} from '$lib/clock.js';

	import EarthThumbnail from '$lib/EarthThumbnail.svelte';

	const clock = clock_context.get();
</script>

<EarthThumbnail
	width={320}
	height={160}
	animationDuration="90s"
	running={$clock.running}
	text="deep breath"
/>
