import type {PortalData} from '$lib/portals/portal';
import Preview from './Preview.svelte';

const data: PortalData = {
	name: 'home',
	slug: '',
	showHomeButton: false,
	Preview,
};

export default data;

export const STORAGE_KEY_STRENGTH_BOOSTER1 = 'cpg_strength_booster1';
export const STORAGE_KEY_STRENGTH_BOOSTER2 = 'cpg_strength_booster2';
export const STORAGE_KEY_STRENGTH_BOOSTER3 = 'cpg_strength_booster3';
