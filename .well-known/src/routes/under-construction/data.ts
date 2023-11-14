import type {PortalData} from '$lib/app/portal';
import Preview from '$routes/under-construction/Preview.svelte';

const data: PortalData = {
	name: 'under construction',
	slug: 'under-construction',
	showHomeButton: true,
	Preview,
};

export default data;
