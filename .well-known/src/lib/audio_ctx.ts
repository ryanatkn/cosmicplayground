import {setContext, getContext} from 'svelte';

// There's an unfortunate overlap between "context" as in
// svelte's `getContext`/`setContext`, and the browser's `AudioContext`.
// For now, the "ctx" abbreviation refers to `AudioContext`,
// and the fully spelled out "context" refers to usage with svelte.

const KEY = Symbol('audio_ctx');

// Components can do `const audio_ctx = get_audio_ctx();`
export const get_audio_ctx = (): AudioContext => getContext<() => AudioContext>(KEY)();

// Puts a lazy getter for `AudioContext` into the component's context.
export const set_audio_ctx = (): (() => AudioContext) => {
	let audio_ctx: AudioContext | undefined;
	const get_audio_ctx = () => {
		if (!audio_ctx) audio_ctx = create_audio_ctx();
		return audio_ctx;
	};
	setContext(KEY, get_audio_ctx);
	return get_audio_ctx;
};

// This should be called during a user input action like a click,
// or it needs `resume` called for some browsers.
export const create_audio_ctx = (): AudioContext => {
	const w: any = window;
	const audio_ctx = new (w.AudioContext || w.webkitAudioContext)();
	return audio_ctx;
};
