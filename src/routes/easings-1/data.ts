import type {PortalData} from '$lib/portal.js';
import Preview from '$routes/easings-1/Preview.svelte';

const data: PortalData = {
	name: 'easing function visualizations',
	slug: 'easings-1',
	showHomeButton: true,
	Preview,
};

export default data;
