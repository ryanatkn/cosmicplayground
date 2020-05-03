import {Semitones} from '../../music/notes.js';
import {Midi} from '../../music/midi.js';

// TODO maybe rename this to `name`?
export type LevelId = string;

export interface LevelDef {
	id: LevelId;
	trialCount: number;
	// The midiMin and midiMax define the entire allowable spectrum of notes.
	// Values like the intervals and octaveShift
	// may spill over combined with the tonic.
	midiMin: Midi;
	midiMax: Midi;
	octaveShiftMin: 0 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9; // TODO shrink to more realistic values?
	octaveShiftMax: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // TODO shrink to more realistic values?
	sequenceLength: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16; // prettier-ignore
	intervals: Semitones[];
	x: number;
	y: number;
	// TODO probably want to specify a tuple of `[LevelId, LevelRating]`
	// so things can unlock with 1-star performances
	// (or even 0-star performances, especially at the very beginning)
	// TODO support something like this,
	// and lay out levels in a pattern that combines levels that you beat into new levels
	// like 1/5/7 + 1/2/4  -> unlocks 1/2/4/5/7
	// unlock: [1, 2],
	unlock?: LevelId[];
}

const baseLevelDef = {
	// TODO support something like this for 3-star accomplishment (or N-star)
	// we probably additionally want to say for each version not just the number of trials,
	// but the number of trials that must be correct to count as success (which should probably be 0 for the first level!)
	// trialCount: [2, 5, 25],
	trialCount: 2,
	midiMin: 46,
	midiMax: 84,
	octaveShiftMin: 0,
	octaveShiftMax: 0,
	sequenceLength: 2,
} as const;

export const levelDefs: LevelDef[] = [
	{
		id: '2,7',
		...baseLevelDef,
		intervals: [2, 7],
		x: 100,
		y: 300,
	},
	{
		id: '4,7',
		...baseLevelDef,
		intervals: [4, 7],
		x: 250,
		y: 300,
	},
	{
		id: '2,4,7',
		...baseLevelDef,
		intervals: [2, 4, 7],
		x: 175,
		y: 175,
		unlock: ['2,7', '4,7'], // TODO rename
	},
	{
		id: '2,4,7-b',
		...baseLevelDef,
		intervals: [2, 4, 7],
		x: 350,
		y: 175,
		unlock: ['2,4,7'], // TODO rename
		octaveShiftMin: -1,
		octaveShiftMax: 0,
	},
	{
		id: '2,4,7-c',
		...baseLevelDef,
		intervals: [2, 4, 7],
		x: 500,
		y: 175,
		unlock: ['2,4,7'], // TODO rename
		octaveShiftMin: -1,
		octaveShiftMax: 1,
	},
	{
		id: '7,12',
		...baseLevelDef,
		intervals: [7, 12],
		x: 300,
		y: 500,
		unlock: ['4,7'], // TODO rename
	},
	{
		id: '4,7,12',
		...baseLevelDef,
		sequenceLength: 4,
		intervals: [4, 7, 12],
		x: 400,
		y: 600,
		unlock: ['4,7'], // TODO rename
	},
];
