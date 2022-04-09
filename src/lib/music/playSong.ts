import {get} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';
import {toResourceStore} from '$lib/app/resource';
import {pauseAudio, playAudio, songs} from '$lib/audio/playAudio';
import type {SongData} from '$lib/music/songs';

let audioKey: symbol | undefined;

// TODO extract an audio player store
// TODO this API is not fun, resources should probably be stores
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const playSong = async (
	songData: SongData,
	onLoading?: (song: ResourceStore<AudioResource>) => any,
	onLoaded?: (song: ResourceStore<AudioResource>) => any,
) => {
	const {url} = songData;
	pauseAudio();
	let song = songs.get(songData.url);
	let loading;
	if (!song) {
		song = toResourceStore('audio', songData.url) as ResourceStore<AudioResource>; // TODO type
		loading = song.load();
		songs.set(url, song); // TODO improve API, maybe return a typed store from `addResource`
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
	return playAudio($s.audio);
};
