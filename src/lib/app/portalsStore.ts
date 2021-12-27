import {writable, type Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

import {type PortalsData, type PortalData, VOID_PORTAL_SLUG} from '$lib/portals/portal.js';

export interface PortalsState {
	data: PortalsData;
}

export interface PortalsStore {
	subscribe: Writable<PortalsState>['subscribe'];
	update: Writable<PortalsState>['update'];
}

export const createPortalsStore = (initialPortalsData: PortalsData): PortalsStore => {
	const store = writable({data: initialPortalsData});
	// TODO we might not want to expose `update` directly, but for now it's fine
	const {subscribe, update} = store;
	return {subscribe, update};
};

export const findPortalBySlug = ($portals: PortalsState, slug: string): PortalData =>
	$portals.data.portalsBySlug.get(slug) || $portals.data.portalsBySlug.get(VOID_PORTAL_SLUG)!;

export const portalsContextKey = {};
export const get_portals = (): PortalsStore => getContext(portalsContextKey);
export const set_portals = (initialPortalsData: PortalsData): PortalsStore => {
	const portals = createPortalsStore(initialPortalsData);
	setContext(portalsContextKey, portals);
	return portals;
};
