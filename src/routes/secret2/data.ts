import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/secret2/Preview.svelte';

const data: PortalData = {
	name: 'secret2',
	slug: 'secret2',
	showHomeButton: true,
	Preview,
};

export default data;
