<script lang="ts">
	import CreditsSoggyPlanet from '$routes/about/CreditsSoggyPlanet.svelte';
	import CreditsPaintFreqs from '$routes/about/CreditsPaintFreqs.svelte';
	import CreditsNightLights from '$routes/about/CreditsNightLights.svelte';
	import CreditsSpaceImages from '$routes/about/CreditsSpaceImages.svelte';
	import CreditsUnderConstruction from '$routes/about/CreditsUnderConstruction.svelte';
	import CreditsMusic from '$routes/about/CreditsMusic.svelte';
	import CreditsBannerAndIcon from '$routes/about/CreditsBannerAndIcon.svelte';
	import Panel from '$lib/app/Panel.svelte';

	// TODO should credits be a portal convention? `/src/portals/{slug}/Credits.svelte`
</script>

<Panel>
	<div class="prose">
		<h2 style:margin-top="0">Credits</h2>
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
				<a href="https://github.com/ryanatkn/cosmicplayground/tree/main/static/assets">
					<code>static/assets</code>
				</a>
			</li>
			<li>more credits below</li>
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
