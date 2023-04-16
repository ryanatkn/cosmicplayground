<script lang="ts">
	import {getDimensions} from '@feltcoop/dealt';

	import Soggy_Planet_Credits from '$routes/soggy-planet/Soggy_Planet_Credits.svelte';
	import Soggy_Planet_Thumbnail from '$routes/soggy-planet/Soggy_Planet_Thumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$routes/soggy-planet/constants';
	import PortalLink from '$lib/app/PortalLink.svelte';
	import DeepBreathCredits from '$routes/deep-breath/DeepBreathCredits.svelte';

	const dimensions = getDimensions();

	$: earthWidth = Math.min(THUMBNAIL_WIDTH_DEFAULT, $dimensions.width - 100); // roughly account for padding/margins of containers
</script>

<Soggy_Planet_Thumbnail {earthWidth} showName={false} />
<p>
	<PortalLink slug="soggy-planet" /> and <PortalLink slug="deep-breath" />
	use <a href="https://earthobservatory.nasa.gov/image-use-policy">NASA imagery</a> and music from
	<a href="https://www.serpentsoundstudios.com">Alexander Nakarada</a>
</p>
<Soggy_Planet_Credits />
<DeepBreathCredits show_earth_map_credits={false} show_music_credits={false} />
