<script lang="ts">
	import DeepBreathCredits from '$lib/portals/deep-breath/DeepBreathCredits.svelte';
	import DeepBreathThumbnail from '$lib/portals/deep-breath/DeepBreathThumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$lib/portals/deep-breath/constants';
	import PortalLink from '$lib/app/PortalLink.svelte';
	import {getDimensions} from '$lib/app/dimensions';

	const dimensions = getDimensions();

	$: earthWidth = Math.min(THUMBNAIL_WIDTH_DEFAULT, $dimensions.width - 100); // roughly account for padding/margins of containers
</script>

<DeepBreathThumbnail {earthWidth} />
<p>
	<PortalLink slug="deep-breath" />
	inhales <a href="https://earthobservatory.nasa.gov/image-use-policy">NASA imagery</a> and music
	from
	<a href="https://www.serpentsoundstudios.com">Alexander Nakarada</a>
</p>
<DeepBreathCredits />
