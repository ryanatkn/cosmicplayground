import type {PortalData} from '$lib/portal';
import Preview from '$routes/clocks/Preview.svelte';

const data: PortalData = {
	name: 'clocks',
	slug: 'clocks',
	showHomeButton: true,
	Preview,
};

export default data;