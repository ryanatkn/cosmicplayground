import {setContext, getContext} from 'svelte/index.mjs';

// There's an unfortunate overlap between "context" as in
// svelte's `getContext`/`setContext`, and the browser's `AudioContext`.
// For now, the "ctx" abbreviation refers to `AudioContext`,
// and the fully spelled out "context" refers to usage with svelte.

export const audioCtxKey = {};

// Components can do `const audioCtx = useAudioCtx();`
export const useAudioCtx = () => getContext(audioCtxKey)();

// Puts a lazy getter for `AudioContext` into the component's context.
export const initAudioCtx = (): (() => AudioContext) => {
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
