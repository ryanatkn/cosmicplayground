import type {PortalData} from '$lib/portal';
import Preview from '$routes/secret3/Preview.svelte';

const data: PortalData = {
	name: 'secret3',
	slug: 'secret3',
	showHomeButton: true,
	Preview,
};

export default data;
