import {type PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'deep breath',
	slug: 'deep-breath',
	coolness: 7, // TODO maybe hide by default but show when offmap areas are rendered?
	showHomeButton: false,
	Preview,
};

export default data;
