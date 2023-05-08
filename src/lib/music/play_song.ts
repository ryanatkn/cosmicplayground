import {get, writable} from 'svelte/store';

import type {AudioResource, ResourceStore} from '$lib/app/resource';
import {toResourceStore} from '$lib/app/resource';
import {pause_audio, play_audio, audio_by_url} from '$lib/audio/play_audio';
import type {Song} from '$lib/music/songs';
import {DEFAULT_VOLUME} from '$lib/helpers';
import {locally_stored} from '$lib/util/locally_stored';

// TODO refactor, probably into context
export const volume = locally_stored(writable(DEFAULT_VOLUME), 'volume');
export const muted = locally_stored(writable(false), 'muted');
// TODO this isn't being used everywhere - see `clock.pause`
export const paused = locally_stored(writable(false), 'paused');
export const shuffle = locally_stored(writable(false), 'shuffle');
export const repeat = locally_stored(writable(false), 'repeat');

export interface SongPlayState {
	id: number;
	song: Song;
	audio: ResourceStore<AudioResource> | null;
	$audio: AudioResource | null;
	audio_el: HTMLAudioElement | null;
	duration: number | null;
	play: Promise<void> | null;
	ended: Promise<unknown> | null;
}

let _id = 0;
const create_song_play_state = (song: Song): SongPlayState => ({
	id: _id++,
	song,
	audio: null,
	$audio: null,
	audio_el: null,
	duration: null,
	play: null,
	ended: null,
});

// global store! ... normally I'd use context for this
export const playing_song = writable<SongPlayState | null>(null);

// TODO do we want a `SongPlay` component/store with methods like `pause`?

// TODO extract an audio player store
// TODO this API is not fun, resources should probably be stores
export const play_song = async (song: Song): Promise<SongPlayState | undefined> => {
	console.log(`play_song`, song, volume);
	// state gets mustated as the `play_song` function progresses
	let state = create_song_play_state(song);
	// TODO cancel any existing? (with events, etc?)
	const $playing_song = get(playing_song);
	if (song === $playing_song?.song) {
		console.log('bailing early');
		return;
	} // TODO BLOCK is this right?
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
	// bail if not still `playing_song`
	const $playing_song_after_load = get(playing_song);
	if ($playing_song_after_load?.id !== state.id) {
		return; // no need to cleanup, at least with the current behavior
	}
	const $audio = get(audio);
	if (!$audio || $audio.status !== 'success' || !$audio.audio) {
		console.error('Failed to load song'); // TODO handle failures better (Dialog error?)
		update_state({$audio});
		return cleanup();
	}
	const audio_el = $audio.audio;
	audio_el.volume = get(volume);
	update_state({
		$audio,
		audio_el,
		duration: audio_el.duration,
		play: get(paused) ? null : play_audio(audio_el), // TODO do something with this before resolving?
		// TODO BLOCK using a promise like this may be a bad idea
		ended: new Promise<void>((resolve) =>
			audio_el!.addEventListener(
				'ended',
				() => {
					cleanup();
					resolve();
				},
				{once: true},
			),
		),
	});
	console.log('loaded', state);
	return state;
};

export const stop_song = (state: SongPlayState | null): void => {
	console.log(`stop_song`, state);
	if (state) {
		const {id, audio_el} = state;
		audio_el?.pause();
		playing_song.update((v) => (v?.id === id ? null : v));
	} else {
		get(playing_song)?.audio_el?.pause();
		playing_song.set(null);
	}
};

export const resume_song = (state: SongPlayState | null): void => {
	console.log(`resume_song`, state);
	const $playing_song = get(playing_song);
	if (state && state.id === $playing_song?.id) {
		playing_song.update(($p) =>
			$p
				? {
						...$p,
						play: ($p.audio_el && play_audio($p.audio_el, null)) || null,
				  }
				: null,
		);
		paused.set(false);
	}
};

export const pause_song = (state: SongPlayState | null): void => {
	console.log(`pause_song`, state);
	const $playing_song = get(playing_song);
	if (state && state.id === $playing_song?.id) {
		$playing_song?.audio_el?.pause();
		paused.set(true);
	}
};
