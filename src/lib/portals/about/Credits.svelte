<script lang="ts">
	import CreditsSoggyPlanet from './CreditsSoggyPlanet.svelte';
	import CreditsPaintFreqs from './CreditsPaintFreqs.svelte';
	import CreditsNightLights from './CreditsNightLights.svelte';
	import CreditsSpaceImages from './CreditsSpaceImages.svelte';
	import CreditsUnderConstruction from './CreditsUnderConstruction.svelte';
	import CreditsStarship from './CreditsStarship.svelte';
	import CreditsBannerAndIcon from './CreditsBannerAndIcon.svelte';

	// TODO should credits be a portal convention? `/src/portals/{slug}/Credits.svelte`
</script>

<div class="markup">
	<h2>Credits</h2>
	<section>
		This project relies on lots of amazing freely licensed content. See below for links and
		copyright info.
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
	</section>
	<hr />
	<section>
		<CreditsBannerAndIcon />
	</section>
	<hr />
	<section>
		<CreditsStarship />
	</section>
	<hr />
	<section>
		<CreditsSpaceImages />
	</section>
	<hr />
	<section>
		<CreditsSoggyPlanet />
	</section>
	<hr />
	<section>
		<CreditsUnderConstruction />
	</section>
	<hr />
	<section>
		<CreditsPaintFreqs />
	</section>
	<hr />
	<section>
		<CreditsNightLights />
	</section>
</div>

<style>
	section {
		margin-top: var(--spacing-5);
	}
</style>
