import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/unlock/Preview.svelte';

const data: PortalData = {
	name: 'unlock',
	slug: 'unlock',
	showHomeButton: false,
	Preview,
};

export default data;
