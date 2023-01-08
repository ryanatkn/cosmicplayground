import type {PortalsData, PortalData} from '$lib/app/portal';

// TODO Keep in sync with `svelte.config.js` until we figure out how to share data.
// This is all necessary because of the dynamic root route `[...slug].svelte`.
import HomePortalData from 'src/routes/data';
import AboutPortalData from '../../routes/data';
import GravityUnlockPortalData from '../../routes/data';
import SoggyPlanetPortalData from '../../routes/data';
import DeepBreathPortalData from '../../routes/data';
import StarlitHammockPortalData from 'src/routes/starlit-hammock/data';
import Easings2PortalData from 'src/routes/easings-2/data';
import PaintFreqsPortalData from 'src/routes/paint-freqs/data';
import Easings1PortalData from 'src/routes/easings-1/data';
import HearingTestPortalData from 'src/routes/hearing-test/data';
import UnderConstructionPortalData from 'src/routes/under-construction/data';
import FreqSpeedsPortalData from 'src/routes/freq-speeds/data';
import ClocksPortalData from 'src/routes/clocks/data';
import FreqSpectaclePortalData from 'src/routes/freq-spectacle/data';

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
