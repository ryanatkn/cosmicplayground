import {type PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'starlit hammock',
	slug: 'starlit-hammock',
	coolness: 6,
	showHomeButton: true,
	Preview,
};

export default data;
