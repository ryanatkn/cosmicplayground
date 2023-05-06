import {get, writable} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';
import {toResourceStore} from '$lib/app/resource';
import {pause_audio, play_audio, audio_by_url} from '$lib/audio/play_audio';
import type {Song} from '$lib/music/songs';

const DEFAULT_VOLUME = 0.5; // TODO where?

export interface SongPlayState {
	id: number;
	song: Song;
	volume: number;
	audio: ResourceStore<AudioResource> | null;
	$audio: AudioResource | null;
	audio_el: HTMLAudioElement | null;
	duration: number | null;
	play: Promise<void> | null;
	ended: Promise<unknown> | null;
}

// global store! ... normally I'd use context for this
export const playing_song = writable<SongPlayState | null>(null);

let id = 0;

// TODO do we want a `SongPlay` component/store with methods like `pause`?

// TODO extract an audio player store
// TODO this API is not fun, resources should probably be stores
export const play_song = async (
	song: Song,
	volume: number = DEFAULT_VOLUME,
	start_paused = false,
): Promise<SongPlayState | undefined> => {
	// state gets mustated as the `play_song` function progresses
	// TODO BLOCK zod init
	let state: SongPlayState = {
		id: id++,
		song,
		volume,
		audio: null,
		$audio: null,
		audio_el: null,
		duration: null,
		play: null,
		ended: null,
	};
	// TODO cancel any existing? (with events, etc?)
	playing_song.set(state);
	const cleanup = (): undefined => {
		playing_song.update((v) => (v === state ? null : v));
		return undefined;
	};
	const update_state = (partial?: Partial<SongPlayState>) => {
		// update the global store, but only if our id is still there
		playing_song.update((v) => (v?.id === state.id ? (state = {...state, ...partial}) : v));
	};
	const {url} = song;
	// TODO is this the desired behavior? if playing already, just pause and abort?
	let abort = false;
	pause_audio((resource) => {
		if (resource.url === url) abort = true;
	});
	if (abort) return cleanup();
	let audio = audio_by_url.get(url);
	if (!audio) {
		audio = toResourceStore('audio', url) as ResourceStore<AudioResource>; // TODO type
		audio_by_url.set(url, audio); // TODO improve API, maybe return a typed store from `addResource`
	}
	update_state({audio});
	console.log('loading', state);
	await audio.load();
	const $audio = get(audio);
	if (!$audio || $audio.status !== 'success' || !$audio.audio) {
		console.error('Failed to load song'); // TODO handle failures better (Dialog error?)
		update_state({$audio});
		return cleanup();
	}
	const audio_el = $audio.audio;
	audio_el.volume = volume; // TODO where?
	update_state({
		$audio,
		audio_el,
		duration: audio_el.duration,
		play: start_paused ? null : play_audio(audio_el), // TODO do something with this before resolving?
		ended: new Promise<void>((resolve) =>
			audio_el!.addEventListener(
				'ended',
				() => {
					resolve();
					cleanup();
				},
				{once: true},
			),
		),
	});
	console.log('loaded', state);
	return state;
};
