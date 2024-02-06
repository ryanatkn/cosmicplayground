<script lang="ts">
	import {base} from '$app/paths';

	import DeepBreathThumbnail from '$routes/deep-breath/DeepBreathThumbnail.svelte';
	import Hud from '$lib/Hud.svelte';
	import HomeButton from '$lib/HomeButton.svelte';
	import ResourcesLoadingProgress from '$lib/ResourcesLoadingProgress.svelte';
	import Panel from '$lib/Panel.svelte';
	import ChunkyButton from '$lib/ChunkyButton.svelte';
	import DeepBreathCredits from '$routes/deep-breath/DeepBreathCredits.svelte';
	import CreditsProjectSignature from '$routes/about/CreditsProjectSignature.svelte';
	import AboutPortalPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/PortalPreview.svelte';
	import type {ResourcesStore} from '$lib/resources';
	import PortalLink from '$lib/PortalLink.svelte';

	export let resources: ResourcesStore;
	export let proceed: () => void;

	// The user can click the title image to load the interactive,
	// but only if the user has clicked the load button directly before.
	// The information around the button is important for the user to understand
	// because the download size is so large.
	const HAS_LOADED_KEY = 'cpg__hasLoadedDeepBreath';
	const hasLoaded = !!localStorage.getItem(HAS_LOADED_KEY);
	const enableLoadingByClickingThumbnail = hasLoaded;

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
<div class="deep_breath_title_screen box width_full">
	<div class="box width_md">
		<DeepBreathThumbnail on_click={enableLoadingByClickingThumbnail ? load : null} />
		<Panel>
			<section class="prose">
				<h2>If all ice on Earth melts, how will sea levels change?</h2>
				<p>
					Deep Breath is an interactive webpage with a rough sketch of Earth's coastlines if all ice
					melts. Most estimates range from 60 to 75 meters above 2020's oceans—some are higher—and
					this map shows about 65 meters. This is an extreme hypothetical: <a
						href="https://wikipedia.org/wiki/Sea_level_rise"
						>Wikipedia can help put it into perspective</a
					>. The project's facts are flawed; see below for more details.
				</p>
				<p>
					There's <a href="https://www.youtube.com/watch?v=7xEPqg-Kyg4"
						>a video on YouTube with a 6 minute tour</a
					>
					set to music, and you can get the same experience by clicking "tour" on the map. The visuals
					are higher quality here than in the video, but the video is recommended for mobile devices,
					older hardware, and screens smaller than 1080p. (it doesn't currently scale the resolution)
					The code and image data are
					<a href="https://github.com/ryanatkn/cosmicplayground">open source on GitHub</a>. Credits
					are below.
				</p>
				<p>
					This map is resource-intensive and may be broken or slow depending on your hardware and
					browser. More optimizations like <a
						href="https://github.com/ryanatkn/cosmicplayground/issues/56">this one</a
					> would help.
				</p>
				<p>See also <PortalLink slug="soggy-planet" />.</p>
			</section>
			<hr />
			{#if $resources.status === 'success'}
				<ChunkyButton on:click={proceed}>back to the map!</ChunkyButton>
			{:else if $resources.status !== 'initial'}
				<ResourcesLoadingProgress {resources} />
			{:else}
				<p>The download is about 75MB of images. If that's ok with you, continue on:</p>
				<ChunkyButton on:click={load}>continue with 75MB download!</ChunkyButton>
			{/if}
			<hr />
			<section class="prose">
				<p>Please be aware that <strong>the project's facts are flawed:</strong></p>
				<ul>
					<li>
						The elevation data is low resolution and the highest sea level is an approximation
						convenient to the source images. The science has wide ranging possible values for
						maximum sea level rise from what I found, and this project displays a value near the
						lower bound. I am not a scientist.
					</li>
					<li>
						Ice remains visible in places like Greenland and Antarctica when sea levels rise, even
						though sea level rise implies the ice has melted. This could be fixed by faking the
						revealed terrain.
					</li>
					<li>
						Landlocked areas below sea level fill with water even though they probably won't flood
						because they don't border the oceans. I find them interesting so I left them in, but
						they could be misleading. The most prominent examples are central Australia and the Aral
						Sea.
					</li>
				</ul>
			</section>
		</Panel>
		<Panel>
			<section class="prose">
				<h2>Credits</h2>
				<DeepBreathCredits />
			</section>
		</Panel>
		<Panel>
			<section class="prose">
				<CreditsProjectSignature />
			</section>
		</Panel>
		<!-- TODO pull this href from portal data? -->
		<section>
			<PortalPreview href="{base}/about">
				<AboutPortalPreview />
			</PortalPreview>
		</section>
	</div>
</div>

<style>
	.deep_breath_title_screen {
		padding: var(--spacing_7) 0;
	}
</style>
