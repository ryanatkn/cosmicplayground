import {get} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';
import {toResourceStore} from '$lib/app/resource';
import {pause_audio, play_audio, audios} from '$lib/audio/play_audio';
import type {Song} from '$lib/music/songs';

let audio_key: symbol | undefined;

export interface SongPlayState {
	audio: HTMLAudioElement;
	play: Promise<void>;
	ended: Promise<unknown>;
}

// TODO extract an audio player store
// TODO this API is not fun, resources should probably be stores
export const play_song = async (song: Song): Promise<SongPlayState | undefined> => {
	const {url} = song;
	// TODO is this the desired behavior? if playing already, just pause and abort?
	let abort = false;
	pause_audio((resource) => {
		if (resource.url === song.url) abort = true;
	});
	if (abort) return;
	let audio = audios.get(song.url);
	let loading;
	if (!audio) {
		audio = toResourceStore('audio', song.url) as ResourceStore<AudioResource>; // TODO type
		loading = audio.load();
		audios.set(url, audio); // TODO improve API, maybe return a typed store from `addResource`
	}
	await loading;
	const key = (audio_key = Symbol());
	const $audio = get(audio);
	if (audio_key !== key) return;
	if (!$audio || $audio.status !== 'success' || !$audio.audio) {
		throw Error('Failed to load song'); // TODO handle failures better (Dialog error?)
	}
	$audio.audio.volume = 0.5; // TODO where?
	return {
		audio: $audio.audio,
		play: play_audio($audio.audio), // TODO do something with this before resolving?
		ended: new Promise((r) => $audio.audio!.addEventListener('ended', r, {once: true})),
	};
};
