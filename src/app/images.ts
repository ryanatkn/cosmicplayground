/*

These images are all from spacetelescope.org.
See https://www.spacetelescope.org/copyright/ for usage info.

I'll probably look through esa.int and hubblesite.org for more images.
For the latter though, individuals need to be contacted for copyright approval.
See https://hubblesite.org/copyright

## Technical notes

- uses webp because jpg artifacts just look not good up close, and we want to zoom in
	- supposedly Safari will support webp the month this was authored (September 2020),
		and that's the last big browser that doesn't
- uses lossy compression because it's passable with webp,
	and it's a tradeoff that lets us have a lot more images in the same budget!
- webp settings
	- main images: max 8192px on longest dimension, webp 100 quality (sometimes lower for file size)
	- thumbnails: max 300px on longest dimension, webp 80 quality
- postprocessing was done with GIMP to enhance the images with a mostly black background
	- the process varied per image
	- the main goals were noise reduction and deeper blacks
	- the original pixels in bright areas are almost identical except for minor adjustments
	- a 10MB file was the rough max target
*/

// TODO this should be JSON for parsing efficiency
// TODO generate most of this data

export interface ImageMeta {
	title: string;
	info: ImageInfo;
	thumbnail: ImageInfo;
	credits: CreditsInfo;
}
export interface ImageInfo {
	url: string;
	width: number;
	height: number;
}
export interface CreditsInfo {
	url: string;
	attribution: string;
}

// The image use guidelines recommend adding this additional credit to retouched images.
// https://www.spacetelescope.org/copyright/
const imageProcessingCredit = 'additional processing by Ryan Atkinson';

const ESA = '<a href="https://www.esa.int/">ESA</a>';
const NASA = '<a href="https://www.nasa.gov/">NASA</a>';
const Hubble = '<a href="https://www.spacetelescope.org/">Hubble</a>';
const STScI = '<a href="https://www.stsci.edu/">STScI</a>';
const AURA = '<a href="https://www.aura-astronomy.org/">AURA</a>';

export const spaceImages: ImageMeta[] = [
	{
		title: 'Hubble sees galaxies galore',
		info: {url: '/assets/space/heic0406a.webp', width: 6200, height: 6200},
		thumbnail: {url: '/assets/space/heic0406a_thumbnail.webp', width: 300, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0406a/',
			attribution: `${NASA}, ${ESA}, and S. Beckwith (${STScI}) and the HUDF Team, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'A gargantuan collision',
		info: {url: '/assets/space/potw1802a.webp', width: 7791, height: 4784},
		thumbnail: {url: '/assets/space/potw1802a_thumbnail.webp', width: 300, height: 184},
		credits: {
			url: 'https://www.spacetelescope.org/images/potw1802a/',
			attribution: `${ESA}/${Hubble} & ${NASA}, <a href="https://archive.stsci.edu/prepds/relics/">RELICS</a>, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Galaxy cluster RCS2 J2327',
		info: {url: '/assets/space/potw1752b.webp', width: 4036, height: 4013},
		thumbnail: {url: '/assets/space/potw1752b_thumbnail.webp', width: 300, height: 298},
		credits: {
			url: 'https://www.spacetelescope.org/images/potw1752b/',
			attribution: `<a href="https://www.eso.org">ESO</a> & ${ESA}/${Hubble} & ${NASA}, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Galaxy cluster MACS J1720+35',
		info: {url: '/assets/space/heic1409a.webp', width: 4800, height: 3600},
		thumbnail: {url: '/assets/space/heic1409a_thumbnail.webp', width: 300, height: 225},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1409a/',
			attribution: `${NASA}, ${ESA}, S. Perlmutter (UC Berkeley, LBNL), A. Koekemoer (${STScI}), M. Postman (${STScI}), A. Riess (${STScI}/JHU), J. Nordin (LBNL, UC Berkeley), D. Rubin (Florida State), and C. McCully (Rutgers University), ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Abell 2218',
		info: {url: '/assets/space/heic0814a.webp', width: 4739, height: 4504},
		thumbnail: {url: '/assets/space/heic0814a_thumbnail.webp', width: 300, height: 285},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0814a/',
			attribution: `${NASA}, ${ESA}, and Johan Richard (Caltech, USA)<br/>
Acknowledgement: Davide de Martin & James Long (${ESA}/${Hubble}), ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Clusters within clusters',
		info: {url: '/assets/space/potw1849a.webp', width: 8192, height: 4608},
		thumbnail: {url: '/assets/space/potw1849a_thumbnail.webp', width: 300, height: 169},
		credits: {
			url: 'https://www.spacetelescope.org/images/potw1849a/',
			attribution: `${NASA}, ${ESA}, J. Mack, and J. Madrid et al., ${imageProcessingCredit}`,
		},
	},
	{
		title: 'WFC3 visible image of the Carina Nebula',
		info: {url: '/assets/space/heic0910e.webp', width: 4533, height: 2618},
		thumbnail: {url: '/assets/space/heic0910e_thumbnail.webp', width: 300, height: 173},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0910e/',
			attribution: `${NASA}, ${ESA} and the Hubble SM4 ERO Team`,
		},
	},
	{
		title: 'Hubble captures view of “Mystic Mountain”',
		info: {url: '/assets/space/heic1007a.webp', width: 2104, height: 1937},
		thumbnail: {url: '/assets/space/heic1007a_thumbnail.webp', width: 300, height: 276},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1007a/',
			attribution: `${NASA}, ${ESA}, M. Livio and the Hubble 20th Anniversary Team (${STScI})`,
		},
	},
	{
		title: 'Star birth in the extreme',
		info: {url: '/assets/space/heic0707a.webp', width: 8192, height: 3968},
		thumbnail: {url: '/assets/space/heic0707a_thumbnail.webp', width: 300, height: 145},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0707a/',
			attribution: `${NASA}, ${ESA}, N. Smith (University of California, Berkeley), and the Hubble Heritage Team (${STScI}/${AURA})`,
		},
	},
	{
		title: 'The Bubble Nebula',
		info: {url: '/assets/space/heic1608a.webp', width: 7857, height: 7462},
		thumbnail: {url: '/assets/space/heic1608a_thumbnail.webp', width: 300, height: 285},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1608a/',
			attribution: `${NASA}, ${ESA}, and the Hubble Heritage Team (${STScI}/${AURA})`,
		},
	},
	{
		title: 'Pillars of Creation, Eagle Nebula',
		info: {url: '/assets/space/heic1501a.webp', width: 6780, height: 7071},
		thumbnail: {url: '/assets/space/heic1501a_thumbnail.webp', width: 288, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1501a/',
			attribution: `${NASA}, ${ESA}/${Hubble}, and the Hubble Heritage Team (${AURA}/${STScI})`,
		},
	},
	{
		title: `Hubble's 28th birthday picture: The Lagoon Nebula`,
		info: {url: '/assets/space/heic1808a.webp', width: 4782, height: 6028},
		thumbnail: {url: '/assets/space/heic1808a_thumbnail.webp', width: 238, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1808a/',
			attribution: `${NASA}, ${ESA}, ${STScI}`,
		},
	},
	{
		title: 'Hubble view of Messier 106',
		info: {url: '/assets/space/heic1302a.webp', width: 7910, height: 6178},
		thumbnail: {url: '/assets/space/heic1302a_thumbnail.webp', width: 300, height: 234},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1302a/',
			attribution: `${NASA}, ${ESA}, the Hubble Heritage Team (${STScI}/${AURA}), and R. Gendler (for the Hubble Heritage Team)<br/>
Acknowledgement: J. GaBany, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Out of this whirl: The Whirlpool Galaxy (M51) and companion galaxy',
		info: {url: '/assets/space/heic0506a.webp', width: 8192, height: 5685},
		thumbnail: {url: '/assets/space/heic0506a_thumbnail.webp', width: 300, height: 208},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0506a/',
			attribution: `${NASA}, ${ESA}, and S. Beckwith (${STScI}), and the Hubble Heritage Team (${STScI}/${AURA}), ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Galaxy NGC 3147',
		info: {url: '/assets/space/heic1913c.webp', width: 4007, height: 4007},
		thumbnail: {url: '/assets/space/heic1913c_thumbnail.webp', width: 300, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1913c/',
			attribution: `${ESA}/Hubble & ${NASA}, A. Riess et al., ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Magnetic monster NGC 1275',
		info: {url: '/assets/space/heic0817a.webp', width: 4633, height: 3590},
		thumbnail: {url: '/assets/space/heic0817a_thumbnail.webp', width: 300, height: 232},
		credits: {
			attribution: `${NASA}, ${ESA}, and Andy Fabian (University of Cambridge, UK), ${imageProcessingCredit}`,
			url: 'https://www.spacetelescope.org/images/heic0817a/',
		},
	},
	{
		title: 'The beautiful barred spiral galaxy NGC 1300',
		info: {url: '/assets/space/opo0501a.webp', width: 6637, height: 3787},
		thumbnail: {url: '/assets/space/opo0501a_thumbnail.webp', width: 300, height: 171},
		credits: {
			attribution: `${NASA}, ${ESA}, and the Hubble Heritage Team (${STScI}/${AURA}), ${imageProcessingCredit}`,
			url: 'https://www.spacetelescope.org/images/opo0501a/',
		},
	},
	{
		title: 'UGC 2885',
		info: {url: '/assets/space/heic2002a.webp', width: 8192, height: 6144},
		thumbnail: {url: '/assets/space/heic2002a_thumbnail.webp', width: 300, height: 225},
		credits: {
			attribution: `${NASA}, ${ESA}, and B. Holwerda (University of Louisville), ${imageProcessingCredit}`,
			url: 'https://www.spacetelescope.org/images/heic2002a/',
		},
	},
	{
		title: 'Revisiting the Veil Nebula',
		info: {url: '/assets/space/heic1520a.webp', width: 8192, height: 5462},
		thumbnail: {url: '/assets/space/heic1520a_thumbnail.webp', width: 300, height: 200},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1520a/',
			attribution: `${NASA}, ${ESA}, and the Hubble Heritage Team (${AURA}/${STScI})`,
		},
	},
	{
		title: 'Hubble view of star-forming region S106',
		info: {url: '/assets/space/heic1118a.webp', width: 4356, height: 3202},
		thumbnail: {url: '/assets/space/heic1118a_thumbnail.webp', width: 300, height: 221},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1118a/',
			attribution: `${NASA} & ${ESA}`,
		},
	},
	{
		title: 'New infrared view of the Horsehead Nebula — Hubble’s 23rd anniversary image',
		info: {url: '/assets/space/heic1307a.webp', width: 2704, height: 2826},
		thumbnail: {url: '/assets/space/heic1307a_thumbnail.webp', width: 287, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1307a/',
			attribution: `${NASA}, ${ESA}, and the Hubble Heritage Team (${AURA}/${STScI})`,
		},
	},
	{
		title: 'Tapestry of Blazing Starbirth',
		info: {url: '/assets/space/heic2007a.webp', width: 8192, height: 5629},
		thumbnail: {url: '/assets/space/heic2007a_thumbnail.webp', width: 300, height: 206},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic2007a/',
			attribution: `${NASA}, ${ESA}, and ${STScI}, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'Hubble snaps close-up of the Tarantula',
		info: {url: '/assets/space/heic1105a.webp', width: 3868, height: 3952},
		thumbnail: {url: '/assets/space/heic1105a_thumbnail.webp', width: 294, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1105a/',
			attribution: `${NASA}, ${ESA}`,
		},
	},
	{
		title: `Westerlund 2 — Hubble’s 25th anniversary image`,
		info: {url: '/assets/space/heic1509a.webp', width: 8192, height: 6138},
		thumbnail: {url: '/assets/space/heic1509a_thumbnail.webp', width: 300, height: 225},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1509a/',
			attribution: `${NASA}, ${ESA}, the Hubble Heritage Team (${STScI}/${AURA}), A. Nota (${ESA}/${STScI}), and the Westerlund 2 Science Team<br/>
The original observations of Westerlund 2 were obtained by the science team: Antonella Nota (${ESA}}/${STScI}), Elena Sabbi (${STScI}), Eva Grebel and Peter Zeidler (Astronomisches Rechen-Institut Heidelberg), Monica Tosi (INAF, Osservatorio Astronomico di Bologna), Alceste Bonanos (National Observatory of Athens, Astronomical Institute), Carol Christian (${STScI}/${AURA}) and Selma de Mink (University of Amsterdam). Follow-up observations were made by the Hubble Heritage team: Zoltan Levay (${STScI}), Max Mutchler, Jennifer Mack, Lisa Frattare, Shelly Meyett, Mario Livio, Carol Christian (${STScI}/${AURA}), and Keith Noll (NASA/GSFC).`,
		},
	},
	{
		title: 'The lure of the rings',
		info: {url: '/assets/space/opo0415a.webp', width: 3628, height: 2357},
		thumbnail: {url: '/assets/space/opo0415a_thumbnail.webp', width: 300, height: 195},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0406a/',
			attribution: `${NASA}, ${ESA}, and the Hubble Heritage Team (${AURA}/${STScI}), ${imageProcessingCredit}`,
		},
	},
	{
		title: `Galactic wreckage in Stephan's Quintet`,
		info: {url: '/assets/space/heic0910i.webp', width: 6064, height: 6760},
		thumbnail: {url: '/assets/space/heic0910i_thumbnail.webp', width: 269, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0910i/',
			attribution: `${NASA}, ${ESA}, and the Hubble SM4 ERO Team, ${imageProcessingCredit}`,
		},
	},
	{
		title: `A 'wallpaper' of distant galaxies is a stunning backdrop for a runaway galaxy`,
		info: {url: '/assets/space/heic0206a.webp', width: 4360, height: 3798},
		thumbnail: {url: '/assets/space/heic0206a_thumbnail.webp', width: 300, height: 261},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic0206a/',
			attribution: `${NASA}, Holland Ford (JHU), the ACS Science Team and ${ESA}<br/>
Image credit: ${NASA}, the ACS Science Team (H. Ford, G. Illingworth, M. Clampin, G. Hartig, T. Allen, K. Anderson, F. Bartko, N. Benitez, J. Blakeslee, R. Bouwens, T. Broadhurst, R. Brown, C. Burrows, D. Campbell, E. Cheng, N. Cross, P. Feldman, M. Franx, D. Golimowski, C. Gronwall, R. Kimble, J. Krist, M. Lesser, D. Magee, A. Martel, W. J. McCann, G. Meurer, G. Miley, M. Postman, P. Rosati, M. Sirianni, W. Sparks, P. Sullivan, H. Tran, Z. Tsvetanov, R. White, and R. Woodruff) and https://www.esa.int/, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'A rose made of galaxies',
		info: {url: '/assets/space/heic1107a.webp', width: 7887, height: 7994},
		thumbnail: {url: '/assets/space/heic1107a_thumbnail.webp', width: 296, height: 300},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1107a/',
			attribution: `${NASA}, ${ESA}, and the Hubble Heritage Team (${STScI}/${AURA}), ${imageProcessingCredit}`,
		},
	},
	{
		title: 'A Discovery of Ghostly Arms',
		info: {url: '/assets/space/potw2029a.webp', width: 3422, height: 2516},
		thumbnail: {url: '/assets/space/potw2029a_thumbnail.webp', width: 300, height: 221},
		credits: {
			url: 'https://www.spacetelescope.org/images/potw2029a/',
			attribution: `${ESA}/${Hubble} & ${NASA}, M. Gregg, ${imageProcessingCredit}`,
		},
	},
	{
		title: 'NGC 1512 and NGC 1510',
		info: {url: '/assets/space/heic1712a.webp', width: 8192, height: 2996},
		thumbnail: {url: '/assets/space/heic1712a_thumbnail.webp', width: 300, height: 110},
		credits: {
			url: 'https://www.spacetelescope.org/images/heic1712a/',
			attribution: `${ESA}/${Hubble}, ${NASA}, ${imageProcessingCredit}`,
		},
	},
];
