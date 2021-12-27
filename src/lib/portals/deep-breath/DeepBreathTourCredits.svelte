<script lang="ts">
	import {blur} from 'svelte/transition';

	import {get_settings} from '$lib/app/settingsStore.js';

	const settings = get_settings();
	$: displayForVideo = $settings.recordingMode;

	export let transitionDuration;

	// transition vars
	const delay = 250;
	const blurAmount = 20;
</script>

<div class="tour-credits" class:displayForVideo>
	<section in:blur={{duration: transitionDuration, amount: blurAmount}}>
		<h2>created by</h2>
		Ryan Atkinson<br />
		<a href="https://twitter.com/ryanatkn">
			@ryanatkn <img
				src="/assets/characters/twit.png"
				alt="@ryanatkn on Twitter"
				class="w-16"
				style="opacity: 0.8;"
			/>
		</a>
		<a href="https://github.com/ryanatkn/cosmicplayground">
			<img
				src="/assets/characters/octocat.png"
				alt="@ryanatkn/cosmicplayground on GitHub"
				class="w-10 ml-1"
				style="margin-right: 16px; opacity: 0.8;"
			/>
		</a>
		<a href="https://www.ryanatkn.com">ryanatkn.com</a>
	</section>
	<section in:blur={{duration: transitionDuration, delay: delay * 1, amount: blurAmount}}>
		<h2>interactive webpage</h2>
		<a href="https://cosmicplayground.org#deep-breath">cosmicplayground.org/#deep-breath</a>
	</section>
	<section in:blur={{duration: transitionDuration, delay: delay * 2, amount: blurAmount}}>
		<h2>open source code & assets</h2>
		<a href="https://github.com/ryanatkn/cosmicplayground">github.com/ryanatkn/cosmicplayground</a>
	</section>
	<section in:blur={{duration: transitionDuration, delay: delay * 3, amount: blurAmount}}>
		<h2>music</h2>
		"Winter" by Alexander Nakarada<br />
		<a href="https://www.serpentsoundstudios.com">serpentsoundstudios.com</a>
	</section>
	<section in:blur={{duration: transitionDuration, delay: delay * 4, amount: blurAmount}}>
		<h2>imagery & data</h2>
		<a href="https://visibleearth.nasa.gov/collection/1484/blue-marble">
			Blue Marble Next Generation
		</a>
		by Reto Stöckli <br />
		<a href="https://visibleearth.nasa.gov">NASA Visible Earth</a> and
		<a href="https://earthobservatory.nasa.gov">NASA Earth Observatory</a>
		(2004) <br />
		<br /> Earth <a href="https://visibleearth.nasa.gov/images/73934/topography">topography</a> and
		<a href="https://visibleearth.nasa.gov/images/73963/bathymetry">bathymetry</a>
		by Jesse Allen <br />
		<a href="https://visibleearth.nasa.gov">NASA Visible Earth</a> and
		<a href="https://earthobservatory.nasa.gov">NASA Earth Observatory</a>
		<br /> using data from the
		<a href="https://www.gebco.net/">General Bathymetric Chart of the Oceans</a>
		<br /> produced by the <a href="https://www.bodc.ac.uk/">British Oceanographic Data Centre</a> (2005)
	</section>
</div>

<style>
	.tour-credits {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 28px;
		font-weight: 300;
		text-align: center;
		text-shadow: 1px 2px rgba(0, 0, 0, 0.8);
	}
	.tour-credits.displayForVideo a {
		color: var(--text_color);
	}
	section {
		max-width: 900px;
		margin: 24px 0;
	}
	section:first-child {
		margin-top: 0;
	}
	h2 {
		font-weight: normal;
		font-size: 20px;
		opacity: 0.5;
		margin-bottom: 14px;
	}
	.tour-credits.displayForVideo h2 {
		color: var(--ocean_text_color);
		opacity: 1;
	}
</style>
