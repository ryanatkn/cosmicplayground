import {setContext, getContext} from 'svelte';

// There's an unfortunate overlap between "context" as in
// svelte's `getContext`/`setContext`, and the browser's `AudioContext`.
// For now, the "ctx" abbreviation refers to `AudioContext`,
// and the fully spelled out "context" refers to usage with svelte.

export const audioCtxKey = {};

// Components can do `const audioCtx = get_audio_ctx();`
export const get_audio_ctx = (): AudioContext => getContext<() => AudioContext>(audioCtxKey)();

// Puts a lazy getter for `AudioContext` into the component's context.
export const set_audio_ctx = (): (() => AudioContext) => {
	let audioCtx: AudioContext | undefined;
	const getAudioCtx = () => {
		if (!audioCtx) audioCtx = createAudioCtx();
		return audioCtx;
	};
	setContext(audioCtxKey, getAudioCtx);
	return getAudioCtx;
};

// This should be called during a user input action like a click,
// or it needs `resume` called for some browsers.
export const createAudioCtx = (): AudioContext => {
	const w: any = window;
	const audioCtx = new (w.AudioContext || w.webkitAudioContext)();
	return audioCtx;
};
