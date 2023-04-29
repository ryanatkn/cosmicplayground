import {get} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';

// TODO custom store? selection store? playlist store?
export const audio_by_url = new Map<string, ResourceStore<AudioResource>>();

export const playing_audio = (url: string): boolean => {
	const audio = audio_by_url.get(url);
	if (!audio) return false;
	const $audio = get(audio); // TODO
	return !!$audio.audio && !$audio.audio.paused;
};

export const pause_audio = (onPause?: (audio: AudioResource) => void): void => {
	// TODO probably set playing audio to module-level state instead of this
	// (seems fine because audio is a global UX)
	for (const audio of audio_by_url.values()) {
		const $audio = get(audio); // TODO
		if ($audio.audio && !$audio.audio.paused) {
			$audio.audio.pause();
			onPause?.($audio);
		}
	}
};

export const play_audio = (audio: HTMLAudioElement, currentTime = 0): Promise<void> => {
	audio.currentTime = currentTime;
	return audio.play();
};
