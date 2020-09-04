<script>
	import ImgLink from './ImgLink.svelte';
	import CreditsItem from './CreditsItem.svelte';
	import DeepBreathCredits from './DeepBreathCredits.svelte';
	import CreditsPersonalSignature from './CreditsPersonalSignature.svelte';
	import EarthThumbnail from './EarthThumbnail.svelte';
</script>

<h3>Credits</h3>
<section>
	<CreditsItem>
		<a href="https://github.com/ryanatkn/cosmicplayground">
			<em>cosmicplayground</em>
			's code
		</a>
		and original assets are licensed under the permissive
		<a href="https://github.com/ryanatkn/cosmicplayground/tree/master/license">ISC license</a>
		. The project also uses the assets listed below - see the included links for more about the
		copyright holders.
	</CreditsItem>
	<CreditsItem>
		<div>
			<ImgLink
				src="assets/space/galaxies.jpg"
				alt="Hubble sees galaxies galore"
				imgStyle="width: 200px;"
			/>
		</div>
		<a href="https://www.spacetelescope.org/images/heic0406a/">Hubble sees galaxies galore</a>
		by
		<a href="https://www.nasa.gov/">NASA</a>
		,
		<a href="https://www.esa.int/">ESA</a>
		, and S. Beckwith (
		<a href="https://www.stsci.edu/">STScI</a>
		) and the HUDF Team
	</CreditsItem>
	<CreditsItem>
		<div>
			<ImgLink alt="construction idea" src="assets/construction/person-dig-idea.gif" />
			<ImgLink alt="construction mammal" src="assets/construction/mammal.gif" />
		</div>
		<a href="#construction">
			<em>under construction</em>
		</a>
		gifs from
		<a href="http://textfiles.com/underconstruction/">textfiles.com/underconstruction</a>
		, salvaged from Geocities by
		<a href="https://www.archiveteam.org/">Archive Team</a>
	</CreditsItem>
	<CreditsItem>
		<div>
			<ImgLink alt="Cosmic Kitty" src="assets/characters/cosmic-kitty.jpg" />
		</div>
		<div>
			Cosmic Kitty pounced out of
			<a href="#paint_freqs">
				<em>paint freqs</em>
			</a>
			.. mreow
		</div>
		<div>
			by Lisa Atkinson,
			<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 license</a>
		</div>
	</CreditsItem>
	<CreditsItem>
		<EarthThumbnail width={600} height={300} animationDuration="45s" />
		<a href="#deep_breath">
			<em>deep breath</em>
		</a>
		inhales
		<a href="https://earthobservatory.nasa.gov/image-use-policy">NASA imagery</a>
		and music from
		<a href="https://www.serpentsoundstudios.com">Alexander Nakarada</a>
		<DeepBreathCredits />
	</CreditsItem>
	<CreditsItem>
		<CreditsPersonalSignature />
	</CreditsItem>
</section>
