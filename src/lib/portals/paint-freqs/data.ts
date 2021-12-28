import {type PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'paint freqs',
	slug: 'paint-freqs',
	coolness: 5,
	showHomeButton: true,
	Preview,
};

export default data;
