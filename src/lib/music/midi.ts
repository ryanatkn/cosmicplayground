import type {Frequency} from '$lib/audio/types.js';

// This project uses `Midi`, the midi number,
// as the standard musical note identity.
// This comes with drawbacks, the obvious one being that
// midi numbers are meaningless to most people,
// but for our purposes the benefits seem to outweight the downsides.
// `Midi` is unambiguous, efficient,
// and easy to work with both programmatically and mathematically.
export type Midi =
  |   0 |   1 |   2 |   3 |   4 |   5 |   6 |   7 |   8 |   9
  |  10 |  11 |  12 |  13 |  14 |  15 |  16 |  17 |  18 |  19
  |  20 |  21 |  22 |  23 |  24 |  25 |  26 |  27 |  28 |  29
  |  30 |  31 |  32 |  33 |  34 |  35 |  36 |  37 |  38 |  39
  |  40 |  41 |  42 |  43 |  44 |  45 |  46 |  47 |  48 |  49
  |  50 |  51 |  52 |  53 |  54 |  55 |  56 |  57 |  58 |  59
  |  60 |  61 |  62 |  63 |  64 |  65 |  66 |  67 |  68 |  69
  |  70 |  71 |  72 |  73 |  74 |  75 |  76 |  77 |  78 |  79
  |  80 |  81 |  82 |  83 |  84 |  85 |  86 |  87 |  88 |  89
  |  90 |  91 |  92 |  93 |  94 |  95 |  96 |  97 |  98 |  99
  | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109
  | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119
  | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127; // prettier-ignore
export const MIDI_NUMBER_MIN = 0;
export const MIDI_NUMBER_MAX = 127;

export const midis: Midi[] = Object.freeze(
	Array.from({length: MIDI_NUMBER_MAX + 1}, (_, i) => i),
) as Midi[];

export const isMidi = (n: number): n is Midi =>
	n >= MIDI_NUMBER_MIN && n <= MIDI_NUMBER_MAX && Number.isInteger(n);

// note/midi/frequency formulas: https://newt.phys.unsw.edu.au/jw/notes.html
// We could give `tuning` a default value
// in the following midi<-->frequency functions,
// but we want to eventually support user-customized tunings everywhere,
// so to avoid errors and make things obvious, it's a required argument.
export const midiToFreq = (midi: Midi, tuning: Frequency): Frequency =>
	2 ** ((midi - 69) / 12) * tuning;

export const freqToMidi = (freq: Frequency, tuning: Frequency): Midi =>
	Math.round(12 * Math.log2(freq / tuning) + 69) as Midi;

export const freqToMidiSafe = (freq: Frequency, tuning: Frequency): Midi | null => {
	const midi = freqToMidi(freq, tuning);
	return isMidi(midi) ? midi : null;
};
