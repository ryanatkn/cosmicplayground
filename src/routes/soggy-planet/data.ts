import type {PortalData} from '$lib/portal';
import Preview from '$routes/soggy-planet/Preview.svelte';

const data: PortalData = {
	name: 'soggy planet',
	slug: 'soggy-planet',
	showHomeButton: false,
	Preview,
};

export default data;
