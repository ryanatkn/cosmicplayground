import {get} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';

export const audios = new Map<string, ResourceStore<AudioResource>>();
// const resources = new Map<string, ResourceStore>(); // TODO refactor a generic interface?

export const pauseAudio = (onPause?: (audio: AudioResource) => void): void => {
	for (const resourceStore of audios.values()) {
		const resource = get(resourceStore); // TODO
		if (resource.audio && !resource.audio.paused) {
			resource.audio.pause();
			onPause?.(resource);
		}
	}
};
export const playAudio = (audio: HTMLAudioElement, currentTime = 0): Promise<void> => {
	audio.currentTime = currentTime;
	return audio.play();
};
