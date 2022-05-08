import type {PortalsData, PortalData} from '$lib/portals/portal';

// TODO Keep in sync with `svelte.config.js` until we figure out how to share data.
// This is all necessary because of the dynamic root route `[...slug].svelte`.
import HomePortalData from '$lib/portals/home/data';
import AboutPortalData from '$lib/portals/about/data';
import GravityUnlockPortalData from '$lib/portals/gravity-unlock/data';
import SoggyPlanetPortalData from '$lib/portals/soggy-planet/data';
import DeepBreathPortalData from '$lib/portals/deep-breath/data';
import StarlitHammockPortalData from '$lib/portals/starlit-hammock/data';
import Easings2PortalData from '$lib/portals/easings-2/data';
import PaintFreqsPortalData from '$lib/portals/paint-freqs/data';
import Easings1PortalData from '$lib/portals/easings-1/data';
import HearingTestPortalData from '$lib/portals/hearing-test/data';
import UnderConstructionPortalData from '$lib/portals/under-construction/data';
import FreqSpeedsPortalData from '$lib/portals/freq-speeds/data';
import ClocksPortalData from '$lib/portals/clocks/data';
import FreqSpectaclePortalData from '$lib/portals/freq-spectacle/data';

const portals: PortalData[] = [
	HomePortalData,
	AboutPortalData,
	GravityUnlockPortalData,
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

export const portalsData: PortalsData = {
	portals,
	portalsBySlug: new Map(portals.map((p) => [p.slug, p])),
};
