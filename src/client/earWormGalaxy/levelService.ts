import {writable, Writable} from 'svelte/store';
import {createMachine, interpret, Interpreter, assign} from 'xstate';

import {LevelDef} from './levelDefs.js';
import {randItem, randInt} from '../../utils/random.js';
import {SMOOTH_GAIN_TIME_CONSTANT} from '../../audio/utils.js';
import {Midi, midiToFreq} from '../../music/midi.js';
import {DEFAULT_TUNING} from '../../music/constants.js';
import {last} from '../../utils/arr.js';
import {computeInterval} from '../../music/notes.js';

const logNew = (...args: any[]) => {
	console.log(
		'%c NEW ',
		'background: #96c; font-weight: bold; color: white;',
		...args,
	);
};

// TODO I think we want a statechart with a nested `trialMachine`
export const createLevelMachine = (context: LevelContext) => {
	return createMachine<LevelContext>(
		{
			id: 'level',
			initial: 'initial',
			context,
			states: {
				initial: {
					on: {
						START: {
							target: 'presentingPrompt',
							actions: 'createNextTrial',
						},
					},
				},
				presentingPrompt: {on: {PRESENTED: 'waitingForInput'}},
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// TODO stopping here -- is the trial a nested machine?
				// presentingPrompt: {
				// 	invoke: {
				// 		id: 'presentPrompt',
				// 		src: async (context, event) => {

				// 		},
				// 		onDone: {
				// 			target: 'waitingForInput',
				// 			actions: assign({presentingIndex: () => null}),
				// 		},
				// 	},
				// },
				waitingForInput: {
					on: {
						// GUESS:
						// TODO maybe these should be split into GUESS_INCORRECTLY and GUESS_CORRECTLY events?
						// 'showingFailureFeedback',
						// 'showingSuccessFeedback',
						// TODO there's also the case of the correct guess but not done, so no state change
					},
				},
				showingSuccessFeedback: {
					on: {NEXT_TRIAL: 'presentingPrompt', COMPLETE_LEVEL: 'complete'},
				},
				showingFailureFeedback: {on: {RETRY_TRIAL: 'presentingPrompt'}},
				complete: {type: 'final'},
			},
		},
		{actions: {createNextTrial}},
	);
};

interface LevelService {
	subscribe: Writable<LevelContext>['subscribe'];
	send(event: EventName | EventData): void;
	guess(midi: Midi): void;
	reset(): void;
	// TODO isInputDisabled?
	// isInputDisabled($level: LevelContext, index: number): boolean;
	// dev and debug methods
	guessCorrectly($level: LevelContext): void;
	getCorrectGuess(trial: Trial | null): number | null;
	interpreter: Interpreter<LevelContext>;
}

type LevelContext = {
	def: LevelDef; // TODO should this be removed from context?
	trial: Trial | null; // TODO these nullable values are unfortunate - maybe make this a type union based on status
	trials: Trial[];
};
const createDefaultContext = (levelDef: LevelDef): LevelContext => ({
	def: levelDef,
	trial: null,
	trials: [],
});

export const createLevelService = (
	levelDef: LevelDef,
	audioCtx: AudioContext,
): LevelService => {
	const defaultContext = createDefaultContext(levelDef);
	const {subscribe, update, set} = writable<LevelContext>(defaultContext);

	let $level: LevelContext; // TODO?
	// subscribe(v => ($level = v)); // TODO?

	let lastEvent: any; // TODO HACK

	const levelMachine = createLevelMachine(defaultContext);
	const interpreter = interpret(levelMachine)
		.onTransition(state => logNew('onTransition', state.value, state))
		.onEvent(e => {
			logNew('onEvent', e);
			lastEvent = e;
		})
		.onChange((context, prevContext) => {
			$level = context;
			logNew('onChange', context, '\nold:', prevContext);
		})
		.onSend(event => {
			logNew('onSend', event);
		})
		.onDone(event => {
			logNew('onDone', event);
		})
		.onStop(() => logNew('onStop'))
		.start();

	const presentTrialPrompt = async (sequence: Midi[]): Promise<void> => {
		logNew('present trial prompt', sequence);
		// audioCtx
		for (let i = 0; i < sequence.length; i++) {
			const note = sequence[i];
			logNew('set interval', note);
			update($level => ({
				...$level,
				trial: $level.trial && {
					...$level.trial,
					presentingIndex: i,
				},
			}));
			await playNote(audioCtx, note, NOTE_DURATION);
		}
		update($level => ({
			...$level,
			trial: $level.trial && {
				...$level.trial,
				presentingIndex: null,
			},
		}));
		// TODO when presenting is complete, we want to automatically transition to the `waitingForInput` state
		interpreter.send('PRESENTED');
	};

	const guess = (midiGuess: Midi) => {
		if (!$level.trial || $level.trial.guessingIndex === null) {
			throw Error(`XSTATE Expected a trial and guessingIndex`); // TODO how to encode in xstate?
		}
		const actual = getCorrectGuess($level.trial);
		if (actual !== midiGuess) {
			logNew('guess incorrect');
			// TODO this is really "on enter showingFailureFeedback state" logic
			setTimeout(() => interpreter.send('RETRY_TRIAL'), 1000);
			interpreter.send('GUESS_INCORRECTLY');
		}
		// else if more -> update current response index
		else if ($level.trial.guessingIndex >= $level.trial.sequence.length - 1) {
			if ($level.trial.index < $level.def.trialCount - 1) {
				logNew('guess correct and done with trial!!');
				// TODO this is really "on enter showingSuccessFeedback state" logic
				setTimeout(() => interpreter.send('NEXT_TRIAL'), 1000);
				interpreter.send('GUESS_CORRECTLY_AND_FINISH_TRIAL');
				// status: 'showingSuccessFeedback',
			} else {
				// TODO this is really "on enter showingSuccessFeedback state" logic
				logNew('guess correct and done with all trials!!!!');
				setTimeout(() => interpreter.send('COMPLETE_LEVEL'), 1000);
				interpreter.send('GUESS_CORRECTLY_AND_FINISH_ALL_TRIALS');
				// status: 'showingSuccessFeedback',
			}
		}
		// else -> SUCCESS -> showingSuccessFeedback
		else {
			logNew('guess correct but not done');
			interpreter.send('GUESS_CORRECTLY_AND_CONTINUE');
			// guessingIndex: $level.trial.guessingIndex + 1,
		}
	};

	return {
		subscribe,
		send: event => interpreter.send(event), // TODO can we remove the wrapper? i.e. is `this` needed?
		guess,
		reset: () => {
			// TODO should this be defined as an event?
			// TODO this causes errors if we have pending async events coming in! they should be canceled!
			set(createDefaultContext(levelDef));
		},
		// isInputDisabled,

		// dev and debug methods
		guessCorrectly: ($level: LevelContext): void => {
			if (lastEvent.type !== 'waitingForInput') return;
			const midi = getCorrectGuess($level.trial);
			if (midi === null) return;
			guess(midi);
		},
		getCorrectGuess,
		interpreter,
	};
};

// TODO play a victory sound on complete
// TODO show feedback on the pressed buttons, regardless of how their interval was input (keyboard, tapping, clicking, debug key, etc)

// TODO convert to xstate

// TODO rename status to state?

const NOTE_DURATION = 500;

interface Trial {
	index: number;
	validNotes: Set<Midi>;
	sequence: Midi[];
	presentingIndex: number | null; // index of interval being presented
	guessingIndex: number | null; // index of interval being guessed
	retryCount: number;
}

type EventName =
	| 'START'
	| 'PRESENTED'
	| 'NEXT_TRIAL'
	| 'RETRY_TRIAL'
	| 'COMPLETE_LEVEL';
type EventData =
	| {type: 'START'}
	| {type: 'NEXT_TRIAL'}
	| {type: 'RETRY_TRIAL'}
	| {type: 'COMPLETE_LEVEL'}
	| {type: 'PRESENTED'}
	| {type: 'GUESS'; midi: Midi};

const playNote = async (
	audioCtx: AudioContext,
	note: Midi,
	durationMs: number,
) => {
	// TODO
	const freq = midiToFreq(note, DEFAULT_TUNING);
	console.log('playing note', note, freq);

	const gain = audioCtx.createGain();
	gain.gain.value = 0.1; // TODO volume variable
	gain.connect(audioCtx.destination);
	const osc = audioCtx.createOscillator();
	osc.type = 'sine';
	osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
	osc.start();
	osc.connect(gain);

	const endTime = audioCtx.currentTime + durationMs / 1000;
	gain.gain.setTargetAtTime(0, endTime, SMOOTH_GAIN_TIME_CONSTANT);
	osc.stop(endTime + SMOOTH_GAIN_TIME_CONSTANT * 2);

	await new Promise(r => setTimeout(r, durationMs));
};

// const isInputDisabled = ($level: LevelService, index: number): boolean => {
// 	if ($level.status !== 'waitingForInput') return true;
// 	if (index === 0) return false;
// 	return !$level.def.intervals.includes(index);
// };

const getCorrectGuess = (trial: Trial | null): Midi | null => {
	if (!trial || trial.guessingIndex === null) return null;
	return trial.sequence[trial.guessingIndex];
};

// TODO what's the right way to update this? multiple actions?
// the docs say to prefer the object syntax for static analysis and
// to NOT to rely on action order... hmm.
// I don't think changing the data structure seems right.
// The function syntax seems "correct" but it is less analyzable.
// https://xstate.js.org/docs/guides/context.html#notes
const createNextTrial = assign((context: LevelContext, _event) => {
	const trial = createNextTrialFromContext(context);
	return {
		trial,
		trials: [...context.trials, trial],
	};
});

const createNextTrialFromContext = ({def, trial}: LevelContext): Trial => {
	logNew('-->createNextTrialFromContext');
	const {midiMin, midiMax, octaveShiftMin, octaveShiftMax} = def;

	const tonicMax = midiMax - 12;
	if (tonicMax < midiMin) {
		throw Error(`tonicMax(${tonicMax}) is bigger than midiMin(${midiMin})`);
	}
	const tonic = randInt(midiMin, tonicMax) as Midi;
	const sequence: Midi[] = [tonic];

	// compute the valid notes
	const intervals = new Set([0, ...def.intervals]); // allow tonic to repeat
	const validNotes: Midi[] = [];
	const noteMin = Math.max(midiMin, tonic + octaveShiftMin * 12) as Midi;
	const noteMax = Math.min(midiMax, tonic + octaveShiftMax * 12 + 12) as Midi; // always span the tonic's octave
	for (let i = noteMin; i <= noteMax; i++) {
		const interval = computeInterval(tonic, i);

		// is the interval valid? add this note if so
		if (intervals.has(interval)) {
			validNotes.push(i);
		}
	}

	if (validNotes.length <= 2) {
		// TODO use TS invariant helper!
		console.log({
			def,
			trial,
			tonic,
			sequence,
			intervals,
			validNotes,
			noteMin,
			noteMax,
		});
		throw Error(
			`validNotes aren't valid! [${validNotes.join(
				', ',
			)}]. Is the code buggy or is the def data bad?`,
		);
	}

	// create the random sequence of notes
	for (let i = 0; i < def.sequenceLength - 1; i++) {
		let nextNote: Midi;
		do {
			nextNote = randItem(validNotes);
		} while (nextNote === last(sequence)); // disallow sequential repeats
		sequence.push(nextNote);
	}

	return {
		index: (trial && trial.index + 1) || 0,
		validNotes: new Set(validNotes),
		sequence,
		presentingIndex: null,
		guessingIndex: null,
		retryCount: 0,
	};
};
