import type {PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'about',
	slug: 'about',
	showHomeButton: true,
	Preview,
};

export default data;
