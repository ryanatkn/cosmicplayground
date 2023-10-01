import type {PortalsData, PortalData} from '$lib/app/portal';

// TODO Keep in sync with `svelte.config.js` until we figure out how to share data.
// This is all necessary because of the dynamic root route `[...slug].svelte`.
import HomePortalData from '$routes/data';
import AboutPortalData from '$routes/about/data';
import UnlockPortalData from '$routes/unlock/data';
import SoggyPlanetPortalData from '$routes/soggy-planet/data';
import DeepBreathPortalData from '$routes/deep-breath/data';
import StarlitHammockPortalData from '$routes/starlit-hammock/data';
import Easings2PortalData from '$routes/easings-2/data';
import PaintFreqsPortalData from '$routes/paint-freqs/data';
import Easings1PortalData from '$routes/easings-1/data';
import HearingTestPortalData from '$routes/hearing-test/data';
import UnderConstructionPortalData from '$routes/under-construction/data';
import FreqSpeedsPortalData from '$routes/freq-speeds/data';
import ClocksPortalData from '$routes/clocks/data';
import FreqSpectaclePortalData from '$routes/freq-spectacle/data';

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
