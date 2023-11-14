import type {PortalData} from '$lib/app/portal';
import Preview from '$routes/unlock/Preview.svelte';

const data: PortalData = {
	name: 'unlock',
	slug: 'unlock',
	showHomeButton: false,
	Preview,
};

export default data;
