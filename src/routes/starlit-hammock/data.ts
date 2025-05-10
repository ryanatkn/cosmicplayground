import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/starlit-hammock/Preview.svelte';

const data: PortalData = {
	name: 'starlit hammock',
	slug: 'starlit-hammock',
	showHomeButton: true,
	Preview,
};

export default data;
