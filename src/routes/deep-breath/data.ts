import type {PortalData} from '$lib/portal';
import Preview from '$routes/deep-breath/Preview.svelte';

const data: PortalData = {
	name: 'deep breath',
	slug: 'deep-breath',
	showHomeButton: false,
	Preview,
};

export default data;
