import {writable, Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

import {PortalsData, PortalData, VOID_PORTAL_SLUG} from '../portals/portal.js';

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
export const usePortals = (): PortalsStore => getContext(portalsContextKey);
export const providePortals = (initialPortalsData: PortalsData): PortalsStore => {
	const portals = createPortalsStore(initialPortalsData);
	setContext(portalsContextKey, portals);
	return portals;
};
