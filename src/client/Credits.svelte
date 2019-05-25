<script>
	import ImgLink from './ImgLink.svelte';
</script>

<h3>credits</h3>
<section class="items">
	<div class="item">
		CPG's code and original assets are
		<a href="https://creativecommons.org/publicdomain/zero/1.0/">
			CC0 licensed
		</a>
		(public domain). The project also uses the permissively licensed assets
		listed below. See the included links for more about the copyright holders.
	</div>
	<hr />
	<div class="item">
		<div>
			<ImgLink
				src="assets/space/galaxies.jpg"
				alt="Hubble sees galaxies galore"
				style="width: 200px;"
				link={true} />
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
	</div>
	<hr />
	<div class="item">
		<div>
			<ImgLink
				alt="construction idea"
				src="assets/construction/construction_person_dig_idea.gif"
				link={true} />
			<ImgLink
				alt="construction mammal"
				src="assets/construction/construction_mammal.gif"
				link={true} />
		</div>
		<em>under construction gifs credit:</em>
		<a href="http://textfiles.com/underconstruction/">
			http://textfiles.com/underconstruction/
		</a>
	</div>
	<hr />
	<div class="item">
		<div>
			<ImgLink
				alt="Cosmic Kitty"
				src="assets/characters/cosmic_kitty.jpg"
				link={true} />
		</div>
		<div>
			Cosmic Kitty pounced out of
			<em>paint freqs</em>
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
	</div>
	<hr />
</section>

<style>
	.items {
		list-style: none;
	}
	.item {
		margin-top: 20px;
	}
</style>
