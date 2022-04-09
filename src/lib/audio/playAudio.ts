import {get} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';

// TODO BLOCK wrong name
export const songs = new Map<string, ResourceStore<AudioResource>>();
// const resources = new Map<string, ResourceStore>(); // TODO refactor a generic interface?

export const pauseAudio = (): void => {
	for (const song of songs.values()) {
		const s = get(song); // TODO
		if (s.audio && !s.audio.paused) s.audio.pause();
	}
};
export const playAudio = (audio: HTMLAudioElement, currentTime = 0): Promise<void> => {
	audio.currentTime = currentTime;
	return audio.play();
};
