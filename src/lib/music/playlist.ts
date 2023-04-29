import {writable, type Readable} from 'svelte/store';

import type {Song} from '$lib/music/songs';

export type PlaylistItemData = {
	song: Song; // TODO BLOCK zod
};

export interface PlaylistState {
	playlist_items: PlaylistItemData[]; // TODO granularity? so make it a component?
}

export interface PlaylistStore extends Readable<PlaylistState> {}

// TODO BLOCK custom store like this, or make it a component?
export const create_playlist = (): PlaylistStore => {
	const {subscribe} = writable<PlaylistState>({playlist_items: []});

	const store: PlaylistStore = {
		subscribe,
	};

	return store;
};
