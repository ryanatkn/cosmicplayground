import type {PortalData} from '$lib/app/portal';
import Preview from '$routes/paint-freqs/Preview.svelte';

const data: PortalData = {
	name: 'paint freqs',
	slug: 'paint-freqs',
	showHomeButton: true,
	Preview,
};

export default data;
