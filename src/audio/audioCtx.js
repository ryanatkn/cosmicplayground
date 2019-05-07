// TODO use Svelte context? gets a bit tricky to initialize
// maybe use `audioCtx.resume` and just create the ctx on init
// export const audioCtxKey = {};

// This should be called during a user input action like a click,
// or it needs `resume` called for some browsers.
// This is tricky when putting it in a top-level Svelte component's `setContext`.
export const createAudioCtx = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
};
