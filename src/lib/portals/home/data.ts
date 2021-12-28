import {type PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'home',
	slug: '',
	coolness: 11, // home is so cool
	showHomeButton: false,
	Preview,
};

export default data;
