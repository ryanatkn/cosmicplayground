import {type PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'about',
	slug: 'about',
	coolness: 4,
	showHomeButton: true,
	Preview,
};

export default data;
