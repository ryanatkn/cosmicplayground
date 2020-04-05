import {Hsl, hslToStr, Hue} from '../utils/colors'; // TODO maybe this belongs somewhere elase - a `colorsAndMusic` module?
import {mapRecord} from '../utils/obj';
import {Midi, midis, isMidi} from './midi';

export const NOTE_FLAT_SYMBOL = '♭';
export const NOTE_SHARP_SYMBOL = '♯';
export type NoteName =
  | 'C-1' | 'C♯-1' | 'D-1' | 'D♯-1' | 'E-1' | 'F-1' | 'F♯-1' | 'G-1' | 'G♯-1' | 'A-1' | 'A♯-1' | 'B-1'
  | 'C0'  | 'C♯0'  | 'D0'  | 'D♯0'  | 'E0'  | 'F0'  | 'F♯0'  | 'G0'  | 'G♯0'  | 'A0'  | 'A♯0'  | 'B0'
  | 'C1'  | 'C♯1'  | 'D1'  | 'D♯1'  | 'E1'  | 'F1'  | 'F♯1'  | 'G1'  | 'G♯1'  | 'A1'  | 'A♯1'  | 'B1'
  | 'C2'  | 'C♯2'  | 'D2'  | 'D♯2'  | 'E2'  | 'F2'  | 'F♯2'  | 'G2'  | 'G♯2'  | 'A2'  | 'A♯2'  | 'B2'
  | 'C3'  | 'C♯3'  | 'D3'  | 'D♯3'  | 'E3'  | 'F3'  | 'F♯3'  | 'G3'  | 'G♯3'  | 'A3'  | 'A♯3'  | 'B3'
  | 'C4'  | 'C♯4'  | 'D4'  | 'D♯4'  | 'E4'  | 'F4'  | 'F♯4'  | 'G4'  | 'G♯4'  | 'A4'  | 'A♯4'  | 'B4'
  | 'C5'  | 'C♯5'  | 'D5'  | 'D♯5'  | 'E5'  | 'F5'  | 'F♯5'  | 'G5'  | 'G♯5'  | 'A5'  | 'A♯5'  | 'B5'
  | 'C6'  | 'C♯6'  | 'D6'  | 'D♯6'  | 'E6'  | 'F6'  | 'F♯6'  | 'G6'  | 'G♯6'  | 'A6'  | 'A♯6'  | 'B6'
  | 'C7'  | 'C♯7'  | 'D7'  | 'D♯7'  | 'E7'  | 'F7'  | 'F♯7'  | 'G7'  | 'G♯7'  | 'A7'  | 'A♯7'  | 'B7'
  | 'C8'  | 'C♯8'  | 'D8'  | 'D♯8'  | 'E8'  | 'F8'  | 'F♯8'  | 'G8'  | 'G♯8'  | 'A8'  | 'A♯8'  | 'B8'
  | 'C9'  | 'C♯9'  | 'D9'  | 'D♯9'  | 'E9'  | 'F9'  | 'F♯9'  | 'G9'; // prettier-ignore

export const chromas = Object.freeze([0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11] as const); // prettier-ignore
export type Chroma = ArrayElement<typeof chromas>; // corresponds to indices of `pitchClasses`
export const pitchClasses = Object.freeze(['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const); // prettier-ignore
export type PitchClass = ArrayElement<typeof pitchClasses>;
export type Octave = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// export type NoteLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'; // TODO this is unused - is it even a useful concept?
export type Semitones = number;

// `Midi` is our primary means of identifying notes,
// and its type is a number with a min of 0, just like array indices.
// The result is that arrays are great for storing static `Midi` data.
// Using the `Midi` number everywhere as array indices has its drawbacks,
// but it's really nice to program with, and it's efficient.
// Using flat data structures instead of objects to pack up this data
// makes the code very naturally extensible - any new data associated to `Midi`
// is just an array of anything that can live anywhere,
// and these arrays are always indexed by `Midi` number.

// TODO consider converting all of these to `Map`s
// TODO do we want to remove the `midi` part of these data array names, or otherwise rename them?
// maybe instead of `midiFoos`, rename to `noteFoos`?
export const midiChromas: Chroma[] = Object.freeze(
	midis.map(m => m % 12),
) as Chroma[];
export const midiPcs: PitchClass[] = Object.freeze(
	midis.map(m => pitchClasses[midiChromas[m]]),
) as PitchClass[];
export const midiOctaves: Octave[] = Object.freeze(
	midis.map(m => Math.floor(m / 12) - 1),
) as Octave[];
export const midiNames: NoteName[] = Object.freeze(
	midis.map(m => midiPcs[m] + midiOctaves[m]),
) as NoteName[];
export const midiNaturals: boolean[] = Object.freeze(
	midis.map(m => midiPcs[m][1] !== NOTE_SHARP_SYMBOL),
) as boolean[];

export const transpose = (midi: Midi, semitones: Semitones): Midi => {
	const transposed = midi + semitones;
	if (!isMidi(transposed)) {
		throw Error(`Failed to transpose midi ${midi} by ${semitones}`);
	}
	return transposed;
};

// Computes the interval from a to b normalized to a single octave.
// Note that compound intervals spanning more than an octave
// are normalized to a single octave, so notes 13 semitones apart
// are actually an interval of 1.
export const computeInterval = (a: Midi, b: Midi): Semitones => {
	let interval = b - a;
	while (interval < 0) interval += 12; // not the best code, but it works
	return interval % 12;
};

// TODO the hue shouldn't be hardcoded from the chroma - this relationship should be user-customizable (`app.colors` or `app.audio.colors` or something)
export const noteChromaToHue = Object.freeze(
	chromas.reduce((result, chroma) => {
		result[chroma] = chroma / 12;
		return result;
	}, {} as Record<Chroma, Hue>),
);
// TODO consider changing to a memoized helper function with optional saturation+lightness
export const noteChromaToHsl = Object.freeze(
	chromas.reduce((result, chroma) => {
		result[chroma] = Object.freeze([
			noteChromaToHue[chroma],
			0.5,
			0.5,
		] as const);
		return result;
	}, {} as Record<Chroma, Hsl>),
);
export const noteChromaToHslString = Object.freeze(
	mapRecord(noteChromaToHsl, hsl => hslToStr(hsl)),
);
