import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/hearing-test/Preview.svelte';

const data: PortalData = {
	name: 'hearing test',
	slug: 'hearing-test',
	showHomeButton: true,
	Preview,
};

export default data;
