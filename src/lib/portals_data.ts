import type {PortalsData, PortalData} from '$lib/portal.js';

// TODO Keep in sync with `svelte.config.js` until we figure out how to share data.
// This is all necessary because of the dynamic root route `[...slug].svelte`.
import HomePortalData from '$routes/data.js';
import AboutPortalData from '$routes/about/data.js';
import UnlockPortalData from '$routes/unlock/data.js';
import SoggyPlanetPortalData from '$routes/soggy-planet/data.js';
import DeepBreathPortalData from '$routes/deep-breath/data.js';
import StarlitHammockPortalData from '$routes/starlit-hammock/data.js';
import Easings2PortalData from '$routes/easings-2/data.js';
import PaintFreqsPortalData from '$routes/paint-freqs/data.js';
import Easings1PortalData from '$routes/easings-1/data.js';
import HearingTestPortalData from '$routes/hearing-test/data.js';
import UnderConstructionPortalData from '$routes/under-construction/data.js';
import FreqSpeedsPortalData from '$routes/freq-speeds/data.js';
import ClocksPortalData from '$routes/clocks/data.js';
import FreqSpectaclePortalData from '$routes/freq-spectacle/data.js';

const portals: PortalData[] = [
	HomePortalData,
	AboutPortalData,
	UnlockPortalData,
	SoggyPlanetPortalData,
	DeepBreathPortalData,
	StarlitHammockPortalData,
	Easings2PortalData,
	PaintFreqsPortalData,
	Easings1PortalData,
	HearingTestPortalData,
	UnderConstructionPortalData,
	FreqSpeedsPortalData,
	ClocksPortalData,
	FreqSpectaclePortalData,
];

export const portals_data: PortalsData = {
	portals,
	portals_by_slug: new Map(portals.map((p) => [p.slug, p])),
};
