import {get} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';
import {toResourceStore} from '$lib/app/resource';
import {pauseAudio, playAudio, audios} from '$lib/audio/playAudio';
import type {SongData} from '$lib/music/songs';

let audioKey: symbol | undefined;

export interface SongPlayState {
	audio: HTMLAudioElement;
	play: Promise<void>;
	ended: Promise<unknown>;
}

// TODO extract an audio player store
// TODO this API is not fun, resources should probably be stores
export const playSong = async (
	songData: SongData,
	onLoading?: (song: ResourceStore<AudioResource>) => any,
	onLoaded?: (song: ResourceStore<AudioResource>) => any,
): Promise<SongPlayState | undefined> => {
	const {url} = songData;
	let abort = false;
	pauseAudio((resource) => {
		if (resource.url === songData.url) abort = true;
	});
	if (abort) return;
	let song = audios.get(songData.url);
	let loading;
	if (!song) {
		song = toResourceStore('audio', songData.url) as ResourceStore<AudioResource>; // TODO type
		loading = song.load();
		audios.set(url, song); // TODO improve API, maybe return a typed store from `addResource`
	}
	// TODO extract the starship mode logic into callbacks/hooks or some other API
	await Promise.all([loading, onLoading?.(song)]);
	const key = (audioKey = Symbol());
	void onLoaded?.(song);
	const $s = get(song);
	if (audioKey !== key) return;
	if (!$s || $s.status !== 'success' || !$s.audio) {
		throw Error('Failed to load song'); // TODO handle failures better (Dialog error?)
	}
	$s.audio.volume = 0.5; // TODO where?
	return {
		audio: $s.audio,
		play: playAudio($s.audio),
		ended: new Promise((r) => $s.audio?.addEventListener('ended', r, {once: true})),
	};
};
