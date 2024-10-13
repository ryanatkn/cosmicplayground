import {get, writable, type Readable} from 'svelte/store';
import {create_context} from '@ryanatkn/fuz/context_helpers.js';

import type {PortalsData, PortalData} from '$lib/portal.js';

export const portals_context = create_context<PortalsStore>();

export interface PortalsState {
	data: PortalsData;
	selected_portal: PortalData | null;
}

export interface PortalsStore extends Readable<PortalsState> {
	select: (slug: string) => void;
}

export const create_portals_store = (initial_state: PortalsState): PortalsStore => {
	const store = writable<PortalsState>(initial_state);
	const {subscribe, update} = store;
	const portalsStore: PortalsStore = {
		subscribe,
		select: (slug: string) => {
			if (get(store).selected_portal?.slug === slug) return;
			update(($portals) => ({
				...$portals,
				selected_portal: $portals.data.portals_by_slug.get(slug)!,
			}));
		},
	};
	return portalsStore;
};
