<script lang="ts">
	import EarthThumbnail from '$lib/app/EarthThumbnail.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export const portal: PortalData = undefined as any;

	const clock = getClock();
</script>

<!-- TODO handle color -->
<EarthThumbnail
	width={320}
	height={160}
	animationDuration="90s"
	running={$clock.running}
	text="deep breath"
/>
