import type {PortalData} from '$lib/app/portal';
import Preview from '$routes/secret2/Preview.svelte';

const data: PortalData = {
	name: 'secret2',
	slug: 'secret2',
	showHomeButton: true,
	Preview,
};

export default data;
