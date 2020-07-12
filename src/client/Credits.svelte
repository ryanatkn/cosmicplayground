<script>
	import ImgLink from './ImgLink.svelte';
	import CreditsItem from './CreditsItem.svelte';
</script>

<h3>credits</h3>
<section>
	<CreditsItem>
		CPG's code and original assets are permissively licensed under the
		permissive
		<a href="https://github.com/ryanatkn/cosmicplayground/tree/master/license">
			ISC license
		</a>
		. The project also uses the assets listed below. See the included links for
		more about the copyright holders.
	</CreditsItem>
	<CreditsItem>
		<div>
			<ImgLink
				src="assets/space/galaxies.jpg"
				alt="Hubble sees galaxies galore"
				imgStyle="width: 200px;" />
		</div>
		<em>galaxies background image credit:</em>
		<a href="https://www.spacetelescope.org/images/heic0406a/">
			Hubble sees galaxies galore
		</a>
		-
		<a href="https://www.nasa.gov/">NASA</a>
		,
		<a href="https://www.esa.int/">ESA</a>
		, and S. Beckwith (
		<a href="https://www.stsci.edu/">STScI</a>
		) and the HUDF Team
	</CreditsItem>
	<CreditsItem>
		<div>
			<ImgLink
				alt="construction idea"
				src="assets/construction/person-dig-idea.gif" />
			<ImgLink alt="construction mammal" src="assets/construction/mammal.gif" />
		</div>
		<em>under construction gifs credit:</em>
		<a href="http://textfiles.com/underconstruction/">
			http://textfiles.com/underconstruction/
		</a>
	</CreditsItem>
	<CreditsItem>
		<div>
			<ImgLink alt="Cosmic Kitty" src="assets/characters/cosmic-kitty.jpg" />
		</div>
		<div>
			Cosmic Kitty pounced out of
			<em>
				<a href="#paint_freqs">paint freqs</a>
			</em>
			.. mreow
		</div>
		<div>
			<em>credit:</em>
			Lisa Atkinson
		</div>
		<div>
			<em>license:</em>
			<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>
		</div>
	</CreditsItem>
</section>
