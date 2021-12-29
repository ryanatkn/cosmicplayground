<script lang="ts">
	import CreditsDeepBreath from './CreditsDeepBreath.svelte';
	import CreditsPaintFreqs from './CreditsPaintFreqs.svelte';
	import CreditsNightLights from './CreditsNightLights.svelte';
	import CreditsSpaceImages from './CreditsSpaceImages.svelte';
	import CreditsUnderConstruction from './CreditsUnderConstruction.svelte';

	// TODO should credits be a portal convention? `/src/portals/{slug}/Credits.svelte`
</script>

<h2>Credits</h2>
<section>
	This project relies on lots of amazing freely licensed content. See below for all links and
	copyright info. Code is licensed <a
		href="https://github.com/ryanatkn/cosmicplayground/blob/master/LICENSE"
		>public domain (The Unlicense) Original assets are licensed <a
			href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a
		>
		unless otherwise specified. See the source respository's
		<a href="https://github.com/ryanatkn/cosmicplayground/tree/master/src/static/assets">
			<code>src/static/assets</code> directory
		</a> for the complete source data.</a
	>.
</section>
<hr />
<section>
	<CreditsSpaceImages />
</section>
<hr />
<section>
	<CreditsNightLights />
</section>
<hr />
<section>
	<CreditsDeepBreath />
</section>
<hr />
<section>
	<CreditsUnderConstruction />
</section>
<hr />
<section>
	<CreditsPaintFreqs />
</section>

<style>
	section {
		margin-top: var(--spacing-5);
	}
</style>
