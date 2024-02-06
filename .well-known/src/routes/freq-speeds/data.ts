import type {PortalData} from '$lib/portal';
import Preview from '$routes/freq-speeds/Preview.svelte';

const data: PortalData = {
	name: 'freq speeds',
	slug: 'freq-speeds',
	showHomeButton: true,
	Preview,
};

export default data;
