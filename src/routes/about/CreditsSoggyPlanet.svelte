<script lang="ts">
	import {getDimensions} from '@feltcoop/dealt';

	import SoggyPlanetCredits from '$routes/soggy-planet/SoggyPlanetCredits.svelte';
	import SoggyPlanetThumbnail from '$routes/soggy-planet/SoggyPlanetThumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$routes/soggy-planet/constants';
	import PortalLink from '$lib/app/PortalLink.svelte';

	const dimensions = getDimensions();

	$: earthWidth = Math.min(THUMBNAIL_WIDTH_DEFAULT, $dimensions.width - 100); // roughly account for padding/margins of containers
</script>

<SoggyPlanetThumbnail {earthWidth} showName={false} />
<p>
	<PortalLink slug="soggy-planet" /> and <PortalLink slug="deep-breath" />
	inhale <a href="https://earthobservatory.nasa.gov/image-use-policy">NASA imagery</a> and music
	from
	<a href="https://www.serpentsoundstudios.com">Alexander Nakarada</a>
</p>
<SoggyPlanetCredits showTourCredits={true} />
