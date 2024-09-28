<script lang="ts">
	import {dimensions_context} from '$lib/dimensions.js';

	import Soggy_Planet_Thumbnail from '$routes/soggy-planet/Soggy_Planet_Thumbnail.svelte';
	import {THUMBNAIL_WIDTH_DEFAULT} from '$routes/soggy-planet/constants.js';

	const dimensions = dimensions_context.get();

	const earthWidth = $derived(Math.min(THUMBNAIL_WIDTH_DEFAULT, $dimensions.width - 100)); // roughly account for padding/margins of containers
</script>

<Soggy_Planet_Thumbnail {earthWidth} showName={false} />
