<script lang="ts">
	import CreditsSoggyPlanet from '$lib/portals/about/CreditsSoggyPlanet.svelte';
	import CreditsPaintFreqs from '$lib/portals/about/CreditsPaintFreqs.svelte';
	import CreditsNightLights from '$lib/portals/about/CreditsNightLights.svelte';
	import CreditsSpaceImages from '$lib/portals/about/CreditsSpaceImages.svelte';
	import CreditsUnderConstruction from '$lib/portals/about/CreditsUnderConstruction.svelte';
	import CreditsMusic from '$lib/portals/about/CreditsMusic.svelte';
	import CreditsBannerAndIcon from '$lib/portals/about/CreditsBannerAndIcon.svelte';
	import Panel from '$lib/app/Panel.svelte';

	// TODO should credits be a portal convention? `/src/portals/{slug}/Credits.svelte`
</script>

<Panel>
	<div class="markup">
		<h2>Credits</h2>
		<p>
			This project relies on lots of amazing freely licensed content. See below for links and
			copyright info.
		</p>
		<ul>
			<li>
				<a href="https://earthobservatory.nasa.gov/image-use-policy">NASA image use policy</a>
			</li>
			<li>
				cosmicplayground's code is <a
					href="https://github.com/cosmicplayground/cosmicplayground/blob/main/license"
					>licensed public domain
				</a>(The Unlicense)
			</li>
			<li>
				source data is in <a
					href="https://github.com/cosmicplayground/cosmicplayground/blob/main/license">the repo</a
				>
				at
				<a href="https://github.com/cosmicplayground/cosmicplayground/tree/main/src/static/assets">
					<code>src/static/assets</code>
				</a>
			</li>
		</ul>
	</div>
</Panel>
<Panel>
	<CreditsBannerAndIcon />
</Panel>
<Panel>
	<CreditsMusic />
</Panel>
<Panel>
	<CreditsSpaceImages />
</Panel>
<Panel>
	<CreditsSoggyPlanet />
</Panel>
<Panel>
	<CreditsUnderConstruction />
</Panel>
<Panel>
	<CreditsPaintFreqs />
</Panel>
<Panel>
	<CreditsNightLights />
</Panel>
