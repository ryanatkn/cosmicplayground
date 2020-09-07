<script>
	import ImgLink from '../../app/ImgLink.svelte';
	import CreditsItem from './CreditsItem.svelte';
	import DeepBreathCredits from '../deep-breath/DeepBreathCredits.svelte';
	import CreditsPersonalSignature from './CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from './CreditsProjectSignature.svelte';
	import EarthThumbnail from '../../app/EarthThumbnail.svelte';
	import PortalLink from '../../app/PortalLink.svelte';
</script>

<h2>Credits</h2>
<CreditsItem>
	This project relies on lots of amazing freely licensed content. Below are all of the credits with
	links and copyright info. All original assets are licensed
	<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>
	unless otherwise specified. See the source respository's
	<a href="https://github.com/ryanatkn/cosmicplayground/tree/master/src/assets">
		<code>src/assets</code>
		directory
	</a>
	for the complete source data. Code is licensed
	<a href="https://github.com/ryanatkn/cosmicplayground/blob/master/LICENSE">AGPL-3.0-only</a>
	.
</CreditsItem>
<CreditsItem>
	<div class="image-wrapper">
		<ImgLink
			src="assets/space/galaxies.jpg"
			alt="Hubble sees galaxies galore"
			imgStyle="width: 200px;"
		/>
	</div>
	<a href="https://www.spacetelescope.org/images/heic0406a/">Hubble sees galaxies galore</a>
	by
	<a href="https://www.nasa.gov/">NASA</a>,
	<a href="https://www.esa.int/">ESA</a>, and S. Beckwith
	(<a href="https://www.stsci.edu/">STScI</a>) and the HUDF Team
</CreditsItem>
<CreditsItem>
	<div class="image-wrapper">
		<ImgLink
			src="assets/earth/night_lights_1.png"
			alt="night lights of Africa, Europe, and the Middle East"
		/>
		<ImgLink src="assets/earth/night_lights_2.png" alt="night lights the Americas" />
		<ImgLink src="assets/earth/night_lights_3.png" alt="night lights of Asia and Australia" />
	</div>
	<a href="https://earthobservatory.nasa.gov/features/NightLights">Earth at Night</a>
	by
	<a href="https://www.nasa.gov/">NASA</a>
	<ul>
		<li>
			<a
				href="https://earthobservatory.nasa.gov/images/79793/city-lights-of-africa-europe-and-the-middle-east"
			>
				Africa, Europe, and the Middle East
			</a>
		</li>
		<li>
			<a href="https://earthobservatory.nasa.gov/images/79787/city-lights-of-the-americas">
				the Americas
			</a>
		</li>
		<li>
			<a href="https://earthobservatory.nasa.gov/images/79790/city-lights-of-asia-and-australia">
				Asia and Australia
			</a>
		</li>
	</ul>
	<a href="https://earthobservatory.nasa.gov">NASA Earth Observatory</a>
	image by Robert Simmon, using
	<a href="http://npp.gsfc.nasa.gov/viirs.html">Suomi NPP VIIRS</a>
	data provided courtesy of Chris Elvidge (NOAA
	<a href="http://www.ngdc.noaa.gov/dmsp/dmsp.html">National Geophysical Data Center</a>).
	Suomi NPP is the result of a partnership between NASA, NOAA, and the Department of Defense.
</CreditsItem>
<CreditsItem>
	<div class="image-wrapper">
		<ImgLink alt="construction idea" src="assets/construction/person-dig-idea.gif" />
		<ImgLink alt="construction mammal" src="assets/construction/mammal.gif" />
	</div>
	<PortalLink slug="under-construction" />
	gifs from
	<a href="http://textfiles.com/underconstruction/">textfiles.com/underconstruction</a>,
	salvaged from Geocities by
	<a href="https://www.archiveteam.org/">Archive Team</a>
</CreditsItem>
<CreditsItem>
	<div class="image-wrapper">
		<ImgLink alt="Cosmic Kitty" src="assets/characters/cosmic-kitty.jpg" />
	</div>
	<div>
		Cosmic Kitty pounced out of
		<PortalLink slug="paint-freqs" />
		.. mreow
	</div>
	<div>
		by Lisa Atkinson,
		<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>
	</div>
</CreditsItem>
<CreditsItem>
	<EarthThumbnail width={600} height={300} animationDuration="45s" />
	<PortalLink slug="deep-breath" />
	inhales
	<a href="https://earthobservatory.nasa.gov/image-use-policy">NASA imagery</a>
	and music from
	<a href="https://www.serpentsoundstudios.com">Alexander Nakarada</a>
	<DeepBreathCredits />
</CreditsItem>

<style>
	.image-wrapper {
		margin-bottom: 10px;
	}
</style>
