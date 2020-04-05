// https://webaudio.github.io/web-midi-api

// TODO extract into a standalone package?

export interface requestMIDIAccess {
	(options?: MIDIOptions): Promise<MIDIAccess>;
}
export interface MIDIOptions {
	sysex?: boolean;
	software?: boolean;
}
export interface MIDIAccess extends EventTarget {
	readonly inputs: MIDIInputMap;
	readonly outputs: MIDIOutputMap;
	onstatechange(event: MIDIConnectionEvent): void; // TODO EventHandler type?
	readonly sysexEnabled: boolean;
}

export type MIDIInputMap = Map<MIDIPortID, MIDIInput>;
export interface MIDIInput extends MIDIPort {
	readonly type: 'input';
	onmidimessage?(event: MIDIMessageEvent): void;
}

export type MIDIOutputMap = Map<MIDIPortID, MIDIOutput>;
export interface MIDIOutput extends MIDIPort {
	readonly type: 'output';
	send(data: MIDIMessageData, timeStamp?: DOMHighResTimeStamp): void;
	clear(): void;
}

export interface MIDIPort extends EventTarget {
	readonly id: MIDIPortID;
	readonly manufacturer?: string;
	readonly name?: string;
	readonly type: MIDIPortType;
	readonly version?: string;
	readonly state: MIDIPortDeviceState;
	readonly connection: MIDIPortConnectionState;
	onstatechange(): void; // TODO EventHandler with `statechange` type - MIDIStateChangeEvent?
	open(): Promise<MIDIPort>;
	close(): Promise<MIDIPort>;
}
export type MIDIPortID = string;
export type MIDIPortType = 'input' | 'output';
export type MIDIPortDeviceState = 'disconnected' | 'connected';
export type MIDIPortConnectionState = 'open' | 'closed' | 'pending';

// TODO this is a global class - do we need to change this to a `.d.ts` file?
export interface MIDIMessageEvent extends Event {
	new (type: string, eventInitDict?: MIDIMessageEventInit): MIDIMessageEvent;
	readonly type: 'midimessage';
	readonly data: MIDIMessageData;
	readonly timeStamp: DOMHighResTimeStamp;
	readonly target: MIDIPort;
}
export interface MIDIMessageEventInit extends EventInit {
	data: MIDIMessageData;
}
export type MIDIMessageData = [number, number, number] & Uint8Array; // TODO does this type work? also, consider using MidiNumber for middle value?

// TODO this is a global class - do we need to change this to a `.d.ts` file?
export interface MIDIConnectionEvent extends Event {
	new (
		type: string,
		eventInitDict?: MIDIConnectionEventInit,
	): MIDIConnectionEvent;
	readonly port: MIDIPort;
}
export interface MIDIConnectionEventInit extends EventInit {
	port: MIDIPort;
}

export enum MIDICommand { // TODO add others
	Stop = 8,
	Start = 9,
	Knob = 11,
	PitchBend = 14,
}
export type MIDIChannel = number; // TODO enumerate? 0-15 or 1-16?
