<script>
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';

	import DeepBreathThumbnail from './DeepBreathThumbnail.svelte';
	import Hud from '../../app/Hud.svelte';
	import HomeButton from '../../app/HomeButton.svelte';
	import PortalLink from '../../app/PortalLink.svelte';
	import ResourcesLoadingProgress from '../../app/ResourcesLoadingProgress.svelte';
	import Panel from '../../app/Panel.svelte';
	import ChunkyButton from '../../app/ChunkyButton.svelte';
	import DeepBreathCredits from './DeepBreathCredits.svelte';
	import CreditsPersonalSignature from '../about/CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from '../about/CreditsProjectSignature.svelte';
	import AboutPortalPreview from '../about/Preview.svelte';
	import PortalPreview from '../home/PortalPreview.svelte';

	export let resources;
	export let proceed;

	// The user can click the title image to load the interactive,
	// but only if the user has clicked the load button directly before.
	// The information around the button is important for the user to understand
	// because the download size is so large.
	const HAS_LOADED_KEY = 'cpg__hasLoadedDeepBreath';
	let hasLoaded = !!localStorage.getItem(HAS_LOADED_KEY);
	$: enableLoadingByClickingThumbnail = hasLoaded;

	const load = async () => {
		await resources.load();
		if ($resources.status === AsyncState.Success) {
			if (!hasLoaded) localStorage.setItem(HAS_LOADED_KEY, 'true');
			proceed();
		}
	};
</script>

<Hud>
	<HomeButton />
</Hud>
<div class="deep-breath-title-screen">
	<DeepBreathThumbnail onClick={enableLoadingByClickingThumbnail ? load : null} />
	<Panel>
		<section>
			<h2>If all ice on Earth melts, how will sea levels change?</h2>
			<p>
				Deep Breath is an interactive webpage with a rough sketch of Earth's coastlines if all ice
				melts. Most estimates range from 60 to 75 meters above 2020's oceans—some are higher—and
				this map shows about 65 meters. This is an extreme hypothetical: <a
					href="https://en.wikipedia.org/wiki/Sea_level_rise"
				>Wikipedia can help put it into perspective</a>.
			</p>
			<p>
				There's <a href="https://www.youtube.com/watch?v=7xEPqg-Kyg4">a video on YouTube with a 6
					minute tour</a> set to music, and you can get the same experience by clicking "begin tour"
				on the map. The visuals are higher quality here than in the video, but the video is recommended
				for mobile devices, older hardware, and screens smaller than 1080p. (it doesn't currently scale
				the resolution) The code and image data are <a
					href="https://github.com/ryanatkn/cosmicplayground"
				>open source on GitHub</a>. Credits are below.
			</p>
			<p>Please be aware that the data is imperfect:</p>
			<ul>
				<li>The elevation data is low resolution and the highest sea level is an approximation.</li>
				<li>
					Ice remains visible in places like Greenland and Antarctica when sea levels rise, even
					though sea level rise implies the ice has melted. This could be fixed by faking the
					revealed terrain.
				</li>
				<li>
					Landlocked areas below sea level fill with water even though they probably won't flood
					because they don't border the oceans. I find them interesting so I left them in, but they
					could be misleading. The most prominent examples are central Australia and the Aral Sea.
				</li>
			</ul>
			<p>
				This page is not mobile friendly! It may also be slow depending on your hardware and
				browser. See <a href="https://www.youtube.com/watch?v=7xEPqg-Kyg4">the video</a> if it doesn't
				work.
			</p>
			<hr />
		</section>
		{#if $resources.status === AsyncState.Success}
			<ChunkyButton on:click={proceed}>back to the map!</ChunkyButton>
		{:else if $resources.status !== AsyncState.Initial}
			<ResourcesLoadingProgress {resources} />
		{:else}
			<p>The download is about 75MB of images. If that's cool with you, click the button below!</p>
			<ChunkyButton on:click={load}>continue with 75MB download!</ChunkyButton>
		{/if}
	</Panel>
	<Panel>
		<section>
			<h2>Credits</h2>
			<DeepBreathCredits />
		</section>
		<hr />
		<section>
			<CreditsPersonalSignature />
			<CreditsProjectSignature />
		</section>
	</Panel>
	<!-- TODO pull this href from portal data? -->
	<section>
		<PortalPreview href="#about">
			<AboutPortalPreview />
		</PortalPreview>
	</section>
</div>

<style>
	.deep-breath-title-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing_lg) 0;
	}
</style>
