import type {PortalData} from '$lib/app/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'hearing test',
	slug: 'hearing-test',
	showHomeButton: true,
	Preview,
};

export default data;
