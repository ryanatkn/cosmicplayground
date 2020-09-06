import {writable, Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

export interface PortalData {
	slug: string;
	title: string;
	coolness: number;
	showBackground: boolean; // show the universal background when the portal is active?
	unlisted?: boolean; // does the portal appear on the main menu?
	// TODO do we want a width/height for thumbnails here?
	// thumbnailWidth: number;
	// thumbnailHeight: number;
}

export interface PortalsState {
	all: PortalData[]; // TODO rename?
}

export interface PortalsStore {
	subscribe: Writable<PortalsState>['subscribe'];
	update: Writable<PortalsState>['update'];
}

export const createPortalsStore = (initialPortalData: PortalData[]): PortalsStore => {
	const store = writable({all: initialPortalData});
	// TODO we might not want to expose `update` directly, but for now it's fine
	const {subscribe, update} = store;
	return {subscribe, update};
};

export const findPortalBySlug = ($portals: PortalsState, slug: string): PortalData => {
	const portal = $portals.all.find((p) => p.slug === slug);
	if (!portal) {
		throw Error(`No portal found with slug "${slug}"`);
	}
	return portal;
};

export const portalsContextKey = {};
export const usePortals = (): PortalsStore => getContext(portalsContextKey);
export const initPortals = (initialPortalData: PortalData[]): PortalsStore => {
	const portals = createPortalsStore(initialPortalData);
	setContext(portalsContextKey, portals);
	return portals;
};
