import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/freq-spectacle/Preview.svelte';

const data: PortalData = {
	name: 'freq spectacle',
	slug: 'freq-spectacle',
	showHomeButton: true,
	Preview,
};

export default data;
