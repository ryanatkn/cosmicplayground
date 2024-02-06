<script lang="ts">
	import Soggy_Planet_Credits from '$routes/soggy-planet/Soggy_Planet_Credits.svelte';
	import Credits_Soggy_Planet_Thumbnail from '$routes/about/Credits_Soggy_Planet_Thumbnail.svelte';
	import PortalLink from '$lib/PortalLink.svelte';
	import DeepBreathCredits from '$routes/deep-breath/DeepBreathCredits.svelte';
</script>

<div class="thumbnail panel spaced">
	<Credits_Soggy_Planet_Thumbnail />
</div>
<p>
	<PortalLink slug="soggy-planet" /> and <PortalLink slug="deep-breath" />
	use <a href="https://earthobservatory.nasa.gov/image-use-policy">NASA imagery</a> and music from
	<a href="https://www.serpentsoundstudios.com">Alexander Nakarada</a>
</p>
<Soggy_Planet_Credits />
<DeepBreathCredits show_earth_map_credits={false} show_music_credits={true} />

<style>
	.thumbnail {
		background: #000;
		padding: var(--spacing_5) 0;
	}
</style>
