import {writable, Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

import {PortalsData, PortalData} from '../portals/portal.js';

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

export const findPortalBySlug = ($portals: PortalsState, slug: string): PortalData => {
	const portal = $portals.data.portalsBySlug.get(slug);
	if (!portal) {
		throw Error(`No portal found with slug "${slug}"`);
	}
	return portal;
};

export const portalsContextKey = {};
export const usePortals = (): PortalsStore => getContext(portalsContextKey);
export const providePortals = (initialPortalsData: PortalsData): PortalsStore => {
	const portals = createPortalsStore(initialPortalsData);
	setContext(portalsContextKey, portals);
	return portals;
};
