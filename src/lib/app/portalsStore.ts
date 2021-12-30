import {get, writable, type Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

import {type PortalsData, type PortalData} from '$lib/portals/portal';
import voidPortal from '$lib/portals/void/data';

export interface PortalsState {
	data: PortalsData;
	selectedPortal: PortalData;
}

export interface PortalsStore {
	subscribe: Writable<PortalsState>['subscribe'];
	select: (slug: string) => void;
}

export const createPortalsStore = (initialState: PortalsState): PortalsStore => {
	const store = writable<PortalsState>(initialState);
	const {subscribe, update} = store;
	const portalsStore: PortalsStore = {
		subscribe,
		select: (slug: string) => {
			if (get(store).selectedPortal.slug === slug) return;
			update(($portals) => ({
				...$portals,
				selectedPortal: findPortalBySlug($portals.data, slug),
			}));
		},
	};
	return portalsStore;
};

export const findPortalBySlug = (portalsData: PortalsData, slug: string): PortalData =>
	portalsData.portalsBySlug.get(slug) || portalsData.portalsBySlug.get(voidPortal.name)!;

export const portalsContextKey = {};
export const getPortals = (): PortalsStore => getContext(portalsContextKey);
export const setPortals = (portals: PortalsStore): void => setContext(portalsContextKey, portals);
