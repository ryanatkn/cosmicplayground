<script lang="ts">
	import Soggy_Planet_Thumbnail from '$routes/soggy-planet/Soggy_Planet_Thumbnail.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import HomeButton from '$lib/app/HomeButton.svelte';
	import ResourcesLoadingProgress from '$lib/app/ResourcesLoadingProgress.svelte';
	import Panel from '$lib/app/Panel.svelte';
	import ChunkyButton from '$lib/app/ChunkyButton.svelte';
	import Soggy_Planet_Credits from '$routes/soggy-planet/Soggy_Planet_Credits.svelte';
	import CreditsProjectSignature from '$routes/about/CreditsProjectSignature.svelte';
	import Soggy_Planet_Portal_Preview from '$routes/soggy-planet/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import type {ResourcesStore} from '$lib/app/resources';
	import PortalLink from '$lib/app/PortalLink.svelte';
	import {points_of_interest} from '$routes/soggy-planet/soggy_planet_tour_data';

	export let resources: ResourcesStore;
	export let proceed: () => void;
	export let start_tour: () => void;

	// The user can click the title image to load the interactive,
	// but only if the user has clicked the load button directly before.
	// The information around the button is important for the user to understand
	// because the download size is so large.
	const HAS_LOADED_KEY = 'cpg__hasLoadedSoggyPlanet';
	const has_loaded = !!localStorage.getItem(HAS_LOADED_KEY);
	$: enable_loading_by_clicking_thumbnail = has_loaded;

	const load = async () => {
		await resources.load();
		if ($resources.status === 'success') {
			if (!has_loaded) localStorage.setItem(HAS_LOADED_KEY, 'true');
			proceed();
		}
	};
</script>

<Hud>
	<HomeButton />
</Hud>
<div class="soggy-planet-title-screen">
	<Soggy_Planet_Thumbnail onClick={enable_loading_by_clicking_thumbnail ? load : null} />
	<Panel>
		<section class="markup">
			<p>
				Soggy Planet is an interactive map of Earth where sea levels rise and fall and the lights of
				civilization shine through the night. It displays <a
					href="https://wikipedia.org/wiki/Past_sea_level">past sea levels</a
				>
				roughly between the lowest point during the
				<a href="https://wikipedia.org/wiki/Last_Glacial_Maximum">last glacial maximum</a> before
				the
				<a href="https://wikipedia.org/wiki/Early_Holocene_sea_level_rise"
					>early Holocene sea level rise</a
				>
				about 12,000 to 7,000 years ago and one
				<a href="https://wikipedia.org/wiki/Sea_level_rise">estimated possible maximum</a>.
			</p>
			<p>
				To take a tour of our soggy planet, click the <button on:click={start_tour}
					>start tour</button
				>
				button on <button on:click={load}>the map</button> or learn more below.
			</p>
			<p>
				This page is not mobile friendly! Sorry, eventually, hopefully. It may also be slow
				depending on your hardware and browser. See <a
					href="https://github.com/ryanatkn/cosmicplayground/issues/56"
					>this performance issue on GitHub</a
				>.
			</p>
			<p>
				The code and image data are
				<a href="https://github.com/ryanatkn/cosmicplayground">open source on GitHub</a>. Credits
				are below.
			</p>
			<p>
				For a different experience about sea level rise see <PortalLink slug="deep-breath" /> 🌚
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
			<h2>Tour</h2>
			<p>
				To take a tour of our Soggy Planet, click the <button on:click={start_tour}
					>start tour</button
				>
				button on <button on:click={load}>the map</button>.
			</p>
			<p>The tour walks through the following points of interest:</p>
			<table>
				<thead><th>name</th><th>myth?</th><th>url</th></thead>
				{#each points_of_interest as point_of_interest (point_of_interest)}
					<tr>
						<td>
							<!-- TODO make these buttons to zoom to the locations on the map -->
							{point_of_interest.name}
						</td>
						<td class="centered-text"
							>{#if point_of_interest.myth}?{/if}</td
						>
						<td><a href={point_of_interest.url}>{point_of_interest.url.substring(8)}</a></td>
					</tr>
				{/each}
			</table>
		</section>
	</Panel>
	<Panel>
		<section class="markup">
			<h2>Credits</h2>
			<Soggy_Planet_Credits />
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
			<Soggy_Planet_Portal_Preview />
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
