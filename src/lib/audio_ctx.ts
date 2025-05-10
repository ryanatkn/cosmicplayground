import {create_context} from '@ryanatkn/fuz/context_helpers.js';

/**
 * Puts a lazy getter for `AudioContext` into the component's context.
 * Components can do `const audio_ctx = get_audio_ctx();`
 */
export const audio_ctx_context = create_context((): (() => AudioContext) => {
	let audio_ctx: AudioContext | undefined;
	return () => {
		audio_ctx ??= create_audio_ctx();
		return audio_ctx;
	};
});

// This should be called during a user input action like a click,
// or it needs `resume` called for some browsers.
export const create_audio_ctx = (): AudioContext => {
	const w: any = window; // TODO use the stub from Earbetter? maybe from Belt?
	const audio_ctx = new (w.AudioContext || w.webkitAudioContext)();
	return audio_ctx;
};
