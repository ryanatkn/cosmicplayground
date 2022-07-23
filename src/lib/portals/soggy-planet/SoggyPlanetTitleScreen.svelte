<script lang="ts">
	import SoggyPlanetThumbnail from './SoggyPlanetThumbnail.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import HomeButton from '$lib/app/HomeButton.svelte';
	import ResourcesLoadingProgress from '$lib/app/ResourcesLoadingProgress.svelte';
	import Panel from '$lib/app/Panel.svelte';
	import ChunkyButton from '$lib/app/ChunkyButton.svelte';
	import SoggyPlanetCredits from './SoggyPlanetCredits.svelte';
	import CreditsProjectSignature from '$lib/portals/about/CreditsProjectSignature.svelte';
	import AboutPortalPreview from '$lib/portals/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import type {ResourcesStore} from '$lib/app/resources';
	import PortalLink from '$lib/app/PortalLink.svelte';

	export let resources: ResourcesStore;
	export let proceed: () => void;

	// The user can click the title image to load the interactive,
	// but only if the user has clicked the load button directly before.
	// The information around the button is important for the user to understand
	// because the download size is so large.
	const HAS_LOADED_KEY = 'cpg__hasLoadedSoggyPlanet';
	const hasLoaded = !!localStorage.getItem(HAS_LOADED_KEY);
	$: enableLoadingByClickingThumbnail = hasLoaded;

	const load = async () => {
		await resources.load();
		if ($resources.status === 'success') {
			if (!hasLoaded) localStorage.setItem(HAS_LOADED_KEY, 'true');
			proceed();
		}
	};
</script>

<Hud>
	<HomeButton />
</Hud>
<div class="soggy-planet-title-screen">
	<SoggyPlanetThumbnail onClick={enableLoadingByClickingThumbnail ? load : null} />
	<Panel>
		<section class="markup">
			<p>
				Soggy Planet is an interactive map of Earth where sea levels rise and fall and the lights of
				civilization shine through the night. Learn more about
				<a href="https://en.wikipedia.org/wiki/Past_sea_level">past sea levels on Wikipedia</a>.
			</p>
			<p>
				This page is not mobile friendly! It may also be slow depending on your hardware and
				browser. See <a href="https://github.com/cosmicplayground/cosmicplayground/issues/56"
					>this performance issue on GitHub</a
				>.
			</p>
			<p>
				The code and image data are
				<a href="https://github.com/cosmicplayground/cosmicplayground">open source on GitHub</a>.
				Credits are below.
			</p>
			<p>
				For a similar but different experience see <PortalLink slug="deep-breath" /> 🌚
			</p>
		</section>
		<hr />
		{#if $resources.status === 'success'}
			<ChunkyButton on:click={proceed}>back to the map!</ChunkyButton>
		{:else if $resources.status !== 'initial'}
			<ResourcesLoadingProgress {resources} />
		{:else}
			<p>The download is about 81MB of images. If that's cool with you, continue on:</p>
			<ChunkyButton on:click={load}>continue with 81MB download!</ChunkyButton>
		{/if}
	</Panel>
	<Panel>
		<section class="markup">
			<h2>Credits</h2>
			<SoggyPlanetCredits />
		</section>
	</Panel>
	<Panel>
		<section class="markup">
			<CreditsProjectSignature />
		</section>
	</Panel>
	<!-- TODO pull this href from portal data? -->
	<section>
		<PortalPreview href="/about">
			<AboutPortalPreview />
		</PortalPreview>
	</section>
</div>

<style>
	.soggy-planet-title-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing_xl7) 0;
	}
</style>
