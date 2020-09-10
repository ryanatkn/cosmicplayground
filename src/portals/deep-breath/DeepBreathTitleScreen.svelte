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
				<PortalLink slug="deep-breath" />
				is an interactive webpage with a rough sketch of Earth's sea levels if all ice melts, about
				60-75 meters above 2020's oceans. Some estimates are higher. The project tries to be
				interesting and visually pleasing, but compared to related tools it has limited scientific
				usefulness. The code and image data are <a
					href="https://github.com/ryanatkn/cosmicplayground"
				>open source on GitHub</a>. See the credits below for more.
			</p>
			<p>Please be aware that the data is imperfect:</p>
			<ul>
				<li>The elevation data is low resolution and the highest sea level is an approximation.</li>
				<li>
					Ice remains visible when sea levels rise, even though sea level rise implies the ice has
					melted. This could be fixed by faking the revealed terrain.
				</li>
				<li>
					Landlocked areas below sea level fill with water even though they probably won't flood
					because they don't border the oceans. I find them interesting so I left them in, but they
					could be misleading. The most prominent examples are central Australia and the Aral Sea.
				</li>
			</ul>
			<p>
				<strong>This page is not mobile friendly!</strong> It may also be really slow depending on your
				hardware and browser.
			</p>
			<hr />
			<p>The download is about 75MB of images. If that's cool with you, click the button below!</p>
		</section>
		{#if $resources.status === AsyncState.Pending || $resources.status === AsyncState.Failure}
			<ResourcesLoadingProgress {resources} />
		{:else}
			<ChunkyButton on:click={load}>proceed with 75MB download</ChunkyButton>
		{/if}
	</Panel>
	<Panel>
		<section>
			<h2>Credits</h2>
			<DeepBreathCredits />
		</section>
		<hr />
		<section>
			<div>
				<CreditsPersonalSignature />
			</div>
			<div>
				<CreditsProjectSignature />
			</div>
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
