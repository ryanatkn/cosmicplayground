<script lang="ts">
	import {get_dimensions} from '$lib/dimensions.js';

	import Soggy_Planet_Thumbnail from '$routes/soggy-planet/Soggy_Planet_Thumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$routes/soggy-planet/constants';

	const dimensions = get_dimensions();

	$: earthWidth = Math.min(THUMBNAIL_WIDTH_DEFAULT, $dimensions.width - 100); // roughly account for padding/margins of containers
</script>

<Soggy_Planet_Thumbnail {earthWidth} showName={false} />
