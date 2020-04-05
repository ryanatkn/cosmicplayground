<script>
	import PianoInstrumentKey from './PianoInstrumentKey.svelte';
	import {midiNaturals, midiChromas} from '../../music/notes.js';
	import {MIDI_MIN, MIDI_MAX} from '../../music/midi.js';

	// TODO should we move these music components to src/music?

	export let width; // : number
	export let midiMin = MIDI_MIN; // ?: Midi
	export let midiMax = MIDI_MAX; // ?: Midi
	export let onPressKey = undefined; // ?(midi: Midi): void
	export let enabledKeys = undefined; // ?: Set<Midi>
	export let highlightedKeys = undefined; // ?: Set<Midi>
	export let emphasizedKeys = undefined; // ?: Set<Midi>

	const isKeyEnabled = (key, enabledKeys) =>
		!enabledKeys || enabledKeys.has(key); // (key: Midi, enabledKeys: Set<Midi> | undefined): boolean

	const isKeyHighlighted = (key, highlightedKeys) =>
		highlightedKeys && highlightedKeys.has(key); // (key: Midi, highlightedKeys: Set<Midi> | undefined): boolean

	const isKeyEmphasized = (key, emphasizedKeys) =>
		emphasizedKeys && emphasizedKeys.has(key); // (key: Midi, emphasizedKeys: Set<Midi> | undefined): boolean

	$: noteCount = midiMax - midiMin + 1;
	$: accidentalKeyWidth = Math.floor(width / noteCount);
	$: naturalKeyHeight = accidentalKeyWidth * KEY_HEIGHT_MULT;

	const UNRENDERED_PIANO_WIDTH = -1;
	const KEY_HEIGHT_MULT = 5; // width * mult = height // TODO - make dependent on container?
	const ACCIDENTAL_KEY_WIDTH_MULT = 7 / 12;
	const ACCIDENTAL_KEY_HEIGHT_MULT = 0.7;

	// TODO calculate layout more precisely?
	const pcLeftOffsetPct = {
		//  Record<Chroma, number>
		0: 0,
		1: 0,
		2: -1 / 3,
		3: 0,
		4: -2 / 3,
		5: 0,
		6: 0,
		7: -1 / 4,
		8: 0,
		9: -1 / 2,
		10: 0,
		11: -3 / 4,
	};

	const computePianoKeys = (
		width,
		midiMin,
		midiMax,
		noteCount,
		accidentalKeyWidth,
		naturalKeyHeight,
	) => {
		const naturalKeyWidth = Math.floor(
			accidentalKeyWidth / ACCIDENTAL_KEY_WIDTH_MULT,
		);
		const accidentalKeyHeight = naturalKeyHeight * ACCIDENTAL_KEY_HEIGHT_MULT;

		const keys = [];
		for (let i = 0; i < noteCount; i++) {
			const midi = i + midiMin;
			let keyWidth; // number
			let keyHeight; // number
			if (midiNaturals[midi]) {
				keyWidth = naturalKeyWidth;
				keyHeight = naturalKeyHeight;
			} else {
				keyWidth = accidentalKeyWidth;
				keyHeight = accidentalKeyHeight;
			}
			const leftOffset =
				i * accidentalKeyWidth +
				pcLeftOffsetPct[midiChromas[midi]] * accidentalKeyWidth;

			keys.push({
				midi,
				leftOffset,
				width: keyWidth,
				height: keyHeight,
			});
		}

		return keys;
	};
	$: pianoKeys = computePianoKeys(
		width,
		midiMin,
		midiMax,
		noteCount,
		accidentalKeyWidth,
		naturalKeyHeight,
	);
</script>

<div className="PianoInstrument" style="position: relative; width: {width}px">
	<div className="PianoInstrument-keys" style="height: {naturalKeyHeight}px">
		{#each pianoKeys as key (key.midi)}
			<PianoInstrumentKey
				midi={key.midi}
				leftOffset={key.leftOffset}
				width={key.width}
				height={key.height}
				isEnabled={isKeyEnabled(key.midi, enabledKeys)}
				isHighlighted={isKeyHighlighted(key.midi, highlightedKeys)}
				isEmphasized={isKeyEmphasized(key.midi, emphasizedKeys)}
				onPress={onPressKey} />
		{/each}
	</div>
</div>
