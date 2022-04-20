import type {PortalsData, PortalData} from '$lib/portals/portal';

// TODO Keep in sync with `svelte.config.js` until we figure out how to share data.
// This is all necessary because of the dynamic root route `[...slug].svelte`.
import HomePortalData from './home/data';
import AboutPortalData from './about/data';
import SoggyPlanetPortalData from './soggy-planet/data';
import DeepBreathPortalData from './deep-breath/data';
import StarlitHammockPortalData from './starlit-hammock/data';
import Easings2PortalData from './easings-2/data';
import PaintFreqsPortalData from './paint-freqs/data';
import Easings1PortalData from './easings-1/data';
import HearingTestPortalData from './hearing-test/data';
import UnderConstructionPortalData from './under-construction/data';
import FreqSpeedsPortalData from './freq-speeds/data';
import ClocksPortalData from './clocks/data';
import FreqSpectaclePortalData from './freq-spectacle/data';

const portals: PortalData[] = [
	HomePortalData,
	AboutPortalData,
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
