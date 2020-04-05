import {
	MIDICommand,
	MIDIMessageEvent,
	MIDIOptions,
	MIDIAccess,
	MIDIChannel,
	requestMIDIAccess,
} from './WebMIDI.js';
import {Midi} from '../music/midi.js';

// WebMIDI helpers specific to cosmicplayground

export type MidiMessage = {
	command: MIDICommand;
	channel: MIDIChannel;
	note: Midi;
	velocity: number; // [0, 1]
};

// Parse basic information out of a MIDI message.
// https://stackoverflow.com/questions/40902864/how-to-parse-web-midi-api-input-messages-onmidimessage
export const parseMidiMessage = (e: MIDIMessageEvent): MidiMessage => {
	return {
		command: e.data[0] >> 4,
		channel: e.data[0] & 0xf,
		note: e.data[1] as Midi, // TODO cast is needed because webMIDI doesn't include the type - should it?
		velocity: e.data[2] / 127,
	};
};

export const requestMidiAccess = async (
	opts?: Partial<MIDIOptions>,
): Promise<MIDIAccess> => {
	const requestMIDIAccessFn: requestMIDIAccess =
		(navigator as any).requestMIDIAccess &&
		(navigator as any).requestMIDIAccess.bind(navigator);
	if (!requestMIDIAccessFn) {
		throw Error(`Midi is not supported in this browser`);
	}
	const options: MIDIOptions = {
		sysex: undefined,
		software: undefined,
		...opts,
	};
	let midiAccess: MIDIAccess;
	try {
		midiAccess = await requestMIDIAccessFn(options);
	} catch (err) {
		console.error('Failed requesting midi access', err);
		throw err;
	}
	return midiAccess;
};
