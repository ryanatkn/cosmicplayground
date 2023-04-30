import {get, writable} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';
import {toResourceStore} from '$lib/app/resource';
import {pause_audio, play_audio, audio_by_url} from '$lib/audio/play_audio';
import type {Song} from '$lib/music/songs';

let audio_key: symbol | undefined;

const DEFAULT_VOLUME = 0.5; // TODO where?

export interface SongPlayState {
	song: Song;
	volume: number;
	audio: ResourceStore<AudioResource> | null;
	$audio: AudioResource | null;
	audio_el: HTMLAudioElement | null;
	play: Promise<void> | null;
	ended: Promise<unknown> | null;
}
export const playing_song = writable<SongPlayState | null>(null);

// TODO extract an audio player store
// TODO this API is not fun, resources should probably be stores
export const play_song = async (
	song: Song,
	volume: number = DEFAULT_VOLUME,
): Promise<SongPlayState | undefined> => {
	// state gets mustated as the `play_song` function progresses
	const state: SongPlayState = {
		song,
		volume,
		audio: null,
		$audio: null,
		audio_el: null,
		play: null,
		ended: null,
	};
	const {url} = song;
	// TODO is this the desired behavior? if playing already, just pause and abort?
	let abort = false;
	pause_audio((resource) => {
		if (resource.url === song.url) abort = true;
	});
	if (abort) return;
	let audio = audio_by_url.get(song.url);
	if (!audio) {
		audio = toResourceStore('audio', song.url) as ResourceStore<AudioResource>; // TODO type
		audio_by_url.set(url, audio); // TODO improve API, maybe return a typed store from `addResource`
	}
	state.audio = audio;
	const key = (audio_key = Symbol());
	await audio.load();
	if (audio_key !== key) return; // canceled
	const $audio = (state.$audio = get(audio));
	if (!$audio || $audio.status !== 'success' || !$audio.audio) {
		console.error('Failed to load song'); // TODO handle failures better (Dialog error?)
		return;
	}
	$audio.audio.volume = volume; // TODO where?
	state.audio_el = $audio.audio;
	state.play = play_audio($audio.audio); // TODO do something with this before resolving?
	state.ended = new Promise((r) => $audio.audio!.addEventListener('ended', r, {once: true}));
	return state;
};
