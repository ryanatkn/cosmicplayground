import {get, writable, type Readable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

import type {PortalsData, PortalData} from '$lib/app/portal';

export interface PortalsState {
	data: PortalsData;
	selectedPortal: PortalData | null;
}

export interface PortalsStore extends Readable<PortalsState> {
	select: (slug: string) => void;
}

export const createPortalsStore = (initialState: PortalsState): PortalsStore => {
	const store = writable<PortalsState>(initialState);
	const {subscribe, update} = store;
	const portalsStore: PortalsStore = {
		subscribe,
		select: (slug: string) => {
			if (get(store).selectedPortal?.slug === slug) return;
			update(($portals) => ({
				...$portals,
				selectedPortal: $portals.data.portalsBySlug.get(slug)!,
			}));
		},
	};
	return portalsStore;
};

export const portalsContextKey = {};
export const getPortals = (): PortalsStore => getContext(portalsContextKey);
export const setPortals = (portals: PortalsStore): PortalsStore =>
	setContext(portalsContextKey, portals);
