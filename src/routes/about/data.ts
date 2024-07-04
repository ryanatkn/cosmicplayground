import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/about/Preview.svelte';

const data: PortalData = {
	name: 'about',
	slug: 'about',
	showHomeButton: true,
	Preview,
};

export default data;
