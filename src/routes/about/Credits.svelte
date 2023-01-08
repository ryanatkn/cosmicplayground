<script lang="ts">
	import CreditsSoggyPlanet from './CreditsSoggyPlanet.svelte';
	import CreditsPaintFreqs from './CreditsPaintFreqs.svelte';
	import CreditsNightLights from './CreditsNightLights.svelte';
	import CreditsSpaceImages from './CreditsSpaceImages.svelte';
	import CreditsUnderConstruction from './CreditsUnderConstruction.svelte';
	import CreditsMusic from './CreditsMusic.svelte';
	import CreditsBannerAndIcon from './CreditsBannerAndIcon.svelte';
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
					href="https://github.com/ryanatkn/cosmicplayground/blob/main/license"
					>licensed public domain
				</a>(The Unlicense)
			</li>
			<li>
				source data is in <a href="https://github.com/ryanatkn/cosmicplayground/blob/main/license"
					>the repo</a
				>
				at
				<a href="https://github.com/ryanatkn/cosmicplayground/tree/main/src/static/assets">
					<code>src/static/assets</code>
				</a>
			</li>
		</ul>
	</div>
</Panel>
<Panel>
	<CreditsMusic />
</Panel>
<Panel>
	<CreditsBannerAndIcon />
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
