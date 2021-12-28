import {type PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'clocks',
	slug: 'clocks',
	coolness: 1,
	showHomeButton: true,
	Preview,
};

export default data;
