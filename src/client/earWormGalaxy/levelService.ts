import {writable, Writable} from 'svelte/store';
import {createMachine, interpret, Interpreter, assign} from 'xstate';

import {LevelDef} from './levelDefs.js';
import {randItem, randInt} from '../../utils/random.js';
import {SMOOTH_GAIN_TIME_CONSTANT} from '../../audio/utils.js';
import {Midi, midiToFreq} from '../../music/midi.js';
import {DEFAULT_TUNING} from '../../music/constants.js';
import {last} from '../../utils/arr.js';
import {computeInterval} from '../../music/notes.js';

const log = (...args: any[]) => {
	console.log(
		'%c NEW ',
		'background: #96c; font-weight: bold; color: white;',
		...args,
	);
};

// TODO I think we want a statechart with a nested `trialMachine`
export const createLevelMachine = (context: LevelContext) => {
	return createMachine<LevelContext, EventData>(
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
				// presentingPrompt: {on: {PRESENTED: 'guessing'}},
				presentingPrompt: {
					invoke: {
						id: 'presentingTrialPrompt',
						src: 'presentPrompt',
						onDone: {
							target: 'guessing',
							// TODO does 'initGuessingIndex' really belong on entry of `guessing`?
							// or exit of `presentingPrompt`?
							actions: ['resetPresentingIndex', 'initGuessingIndex'],
						},
					},
					on: {
						PRESENT_NOTE: {actions: 'presentNote'},
					},
				},
				guessing: {
					on: {
						// TODO this could be represented as a GUESS event with conditions,
						// but the recommendation is to keep them as separate things.
						// This externalizes the logic of the guess.
						// There's tradeoffs here I don't understand -
						// I can see it being easier to drive the state machine
						// with simple events that don't need the midi guess param.
						// GUESS
						// 'showingFailureFeedback',
						// 'showingSuccessFeedback',

						// TODO this should play the note and also
						// playing the note with event daata seems messy though,
						// since that's not how correct guesses work!
						// correct guesses use the context data to make this implicit.
						// this all seems to stem from the fact that we're not using conditions here,
						// instead we've externalized the logic (see comment above)
						GUESS_INCORRECTLY: {
							target: 'showingFailureFeedback',
							actions: 'playIncorrectNote',
						},
						// TODO how to model these cleanly? they go to different places!
						GUESS_CORRECTLY_AND_FINISH_TRIAL: {
							target: 'showingSuccessFeedback',
							actions: 'playCurrentNote',
						},
						GUESS_CORRECTLY_AND_FINISH_LEVEL: {
							target: 'showingSuccessFeedback',
							actions: 'playCurrentNote',
						},
						GUESS_CORRECTLY_AND_WAIT_FOR_MORE: {
							// TODO these don't execute in this order
							// how to play the right note?
							actions: 'nextGuessingIndex',
						},
					},
				},
				showingSuccessFeedback: {
					// on: {NEXT_TRIAL: 'presentingPrompt', COMPLETE_LEVEL: 'complete'},
					after: {
						SUCCESS_FEEDBACK_DELAY: 'complete', // TODO !
					},
				},
				showingFailureFeedback: {
					// on: {RETRY_TRIAL: 'presentingPrompt'}
					after: {
						FAILURE_FEEDBACK_DELAY: 'complete',
					},
				},
				complete: {type: 'final'},
			},
		},
		{
			// TODO should we inline these functions?
			actions: {
				createNextTrial,
				presentNote,
				resetPresentingIndex: assign<LevelContext>({
					presentingIndex: null,
				}),
				// TODO is this the best implementation? is it too granular?
				initGuessingIndex: assign<LevelContext>({
					guessingIndex: 0,
				}),
				// TODO should this validate that we don't overflow? should it error on null?
				// mainly I'm thinking of the case that GUESS_CORRECTLY_AND_WAIT_FOR_MORE is sent when invalid
				// There's a larger question here about event validation.
				nextGuessingIndex: assign<LevelContext>({
					guessingIndex: context => {
						// TODO see below about playCurrentNote
						// action order shouldn't matter, so we're coupling these two effects together
						playMidiNote(
							context.audioCtx,
							context.trial!.sequence[context.guessingIndex!],
							NOTE_DURATION,
						);
						return context.guessingIndex! + 1;
					},
				}),
				playCurrentNote: context => {
					// TODO yikes ... should the note be event data? looked up some other way?
					// TODO this is duplicated in `nextGuessingIndex` above, see its comments for why
					playMidiNote(
						context.audioCtx,
						context.trial!.sequence[context.guessingIndex!],
						NOTE_DURATION,
					);
				},
				playIncorrectNote: (context, event) => {
					// TODO we could make this `playNote` with event data and
					// use it in the above two places, right?
					// problem with that is the GUESS_CORRECTLY_* events then require the correct midi note.
					// that makes them not as easy to trigger, like in the visualizer,
					// and it duplicates information implicit in the context, confusing the source of truth.
					if (event.type !== 'GUESS_INCORRECTLY') {
						throw Error(
							`Invalid event type ${event.type} for "playIncorrectNote" action`,
						);
					}
					playMidiNote(context.audioCtx, event.note, NOTE_DURATION);
				},
			},
			services: {presentPrompt},
			delays: {
				SUCCESS_FEEDBACK_DELAY: 1000,
				FAILURE_FEEDBACK_DELAY: 1000,
			},
		},
	);
};

interface LevelService {
	subscribe: Writable<LevelStoreState>['subscribe'];
	send(event: EventData): void;
	guess(midi: Midi): void;
	reset(): void;
	// TODO isInputDisabled?
	// isInputDisabled($level: LevelContext, index: number): boolean;
	// dev and debug methods
	guessCorrectly(context: LevelContext): void;
	getCorrectGuess(context: LevelContext): number | null;
	interpreter: Interpreter<LevelContext, LevelStateSchema, EventData>;
}

type LevelStateSchema = any; // TODO ??

type LevelContext = {
	def: LevelDef; // TODO this doesn't belong here right?
	audioCtx: AudioContext; // TODO this doesn't belong here right?
	trial: Trial | null; // TODO these nullable values are unfortunate - maybe make this a type union based on status
	trials: Trial[];
	presentingIndex: number | null; // index of interval being presented
	guessingIndex: number | null; // index of interval being guessed
	retryCount: number;
};
const createDefaultContext = (
	levelDef: LevelDef,
	audioCtx: AudioContext,
): LevelContext => ({
	def: levelDef,
	audioCtx: audioCtx,
	trial: null,
	trials: [],
	presentingIndex: null,
	guessingIndex: null,
	retryCount: 0,
});

type LevelStoreState = {
	state: Interpreter<LevelContext, LevelStateSchema, EventData>['state'];
	context: LevelContext;
};

export const createLevelService = (
	levelDef: LevelDef,
	audioCtx: AudioContext,
): LevelService => {
	const defaultContext = createDefaultContext(levelDef, audioCtx);

	let $level: LevelStoreState; // TODO?

	let lastEvent: any; // TODO HACK

	const levelMachine = createLevelMachine(defaultContext);
	const interpreter = interpret<LevelContext, LevelStateSchema, EventData>(
		levelMachine,
	)
		.onTransition(state => log('onTransition', state.value, state))
		.onEvent(e => {
			log('onEvent', e);
			lastEvent = e;
		})
		.onChange((context, _prevContext) => {
			log('onChange', context);
			$level = {state: interpreter.state, context};
			set($level);
		})
		.onSend(event => {
			log('onSend', event);
		})
		.onDone(event => {
			log('onDone', event);
		})
		.onStop(() => log('onStop'));

	const {subscribe, set} = writable<LevelStoreState>({
		state: interpreter.state,
		context: defaultContext,
	});

	// start after store is ready
	// TODO check this is necessary
	interpreter.start();

	// TODO These aren't conditions in a single GUESS event because
	// XState recommends not doing that when possible.
	// They also don't forward the guess data for correct guesses
	// to avoid duplicating the source of truth.
	// However this makes the machine implementation more complex - see above for more.
	const guess = (midiGuess: Midi) => {
		const {context} = $level;
		if (!context.trial || context.guessingIndex === null) {
			throw Error(`XSTATE Expected a trial and guessingIndex`); // TODO how to encode in xstate?
		}
		const actual = getCorrectGuess(context);
		log('midiGuess', midiGuess);
		log('actual', actual);
		if (actual !== midiGuess) {
			log('guessguessguessguessguess incorrect');
			// TODO this is really "on enter showingFailureFeedback state" logic
			// setTimeout(() => interpreter.send('RETRY_TRIAL'), 1000); // TODO can be modeled with "after" right?
			interpreter.send({type: 'GUESS_INCORRECTLY', note: midiGuess});
		}
		// else if more -> update current response index
		else if (context.guessingIndex >= context.trial.sequence.length - 1) {
			if (context.trial.index < context.def.trialCount - 1) {
				log('guessguessguessguessguess correct and done with trial!!');
				// TODO this is really "on enter showingSuccessFeedback state" logic
				// setTimeout(() => interpreter.send('NEXT_TRIAL'), 1000); // TODO can be modeled with "after" right?
				interpreter.send('GUESS_CORRECTLY_AND_FINISH_TRIAL');
				// status: 'showingSuccessFeedback',
			} else {
				// TODO this is really "on enter showingSuccessFeedback state" logic
				log('guessguessguessguessguess correct and done with all trials!!!!');
				// setTimeout(() => interpreter.send('COMPLETE_LEVEL'), 1000); // TODO can be modeled with "after" right?
				interpreter.send('GUESS_CORRECTLY_AND_FINISH_LEVEL');
				// status: 'showingSuccessFeedback',
			}
		}
		// else -> SUCCESS -> showingSuccessFeedback
		else {
			log('guessguessguessguessguess correct but not done');
			interpreter.send('GUESS_CORRECTLY_AND_WAIT_FOR_MORE');
			// guessingIndex: context.trial.guessingIndex + 1,
		}
	};

	return {
		subscribe,
		send: event => interpreter.send(event), // TODO can we remove the wrapper? i.e. is `this` needed?
		guess,
		reset: () => {
			// TODO should this be defined as an event?
			// TODO this causes errors if we have pending async events coming in! they should be canceled!
			throw Error('TODO');
			// set({state: interpreter.state, context: createDefaultContext(levelDef, audioCtx)});
			// TODO need to update interpreter - what's the best way to do this?
			// should there be no "reset' function? only send RESET or something?
		},
		// isInputDisabled,

		// dev and debug methods
		guessCorrectly: (): void => {
			if (lastEvent.type !== 'guessing') return;
			const midi = getCorrectGuess($level.context);
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
}

type EventData =
	| {type: 'START'}
	| {type: 'NEXT_TRIAL'}
	| {type: 'RETRY_TRIAL'}
	| {type: 'COMPLETE_LEVEL'}
	| {type: 'PRESENTED'}
	| {type: 'GUESS'; midi: Midi}
	| {type: 'PRESENT_NOTE'; note: Midi; index: number}
	| {type: 'GUESS_INCORRECTLY'; note: Midi}
	| {type: 'GUESS_CORRECTLY_AND_FINISH_TRIAL'}
	| {type: 'GUESS_CORRECTLY_AND_FINISH_LEVEL'}
	| {type: 'GUESS_CORRECTLY_AND_WAIT_FOR_MORE'};

// const isInputDisabled = ($level: LevelService, index: number): boolean => {
// 	if ($level.status !== 'guessing') return true;
// 	if (index === 0) return false;
// 	return !$level.def.intervals.includes(index);
// };

const getCorrectGuess = (context: LevelContext): Midi | null => {
	if (!context.trial || context.guessingIndex === null) return null;
	return context.trial.sequence[context.guessingIndex];
};

// TODO what's the right way to update this? multiple actions?
// the docs say to prefer the object syntax for static analysis and
// to NOT to rely on action order... hmm.
// I don't think changing the data structure seems right.
// The function syntax seems "correct" but it is less analyzable.
// https://xstate.js.org/docs/guides/context.html#notes
const createNextTrial = assign<LevelContext>(
	(context: LevelContext, _event) => {
		const trial = createNextTrialFromContext(context);
		return {
			trial,
			trials: [...context.trials, trial],
		};
	},
);

const createNextTrialFromContext = ({def, trial}: LevelContext): Trial => {
	log('---> createNextTrialFromContext');
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
		log({
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
	};
};

const presentPrompt = (context: LevelContext) => async (
	callback: (e: EventData) => void, // TODO better type? is there a helper like `assign` for this? or easy way to access this type?
) => {
	const sequence = context.trial!.sequence;
	log('---> presentTrialPrompt vvvvvvvvvvvvv', sequence);
	for (let i = 0; i < sequence.length; i++) {
		const note = sequence[i];
		callback({type: 'PRESENT_NOTE', note, index: i});
		await new Promise(r => setTimeout(r, NOTE_DURATION));
	}
	// TODO the final action is performed via `onDone`, not by a final callback event.
	// is that best?
	// callback('PRESENTED_PROMPT'); => presentingIndex: null
	log('<--- presentTrialPrompt ^^^^^^^^^^^^^');
};

const presentNote = assign<LevelContext, EventData>((context, event) => {
	if (event.type === 'PRESENT_NOTE') {
		// TODO should this action be split out into PLAY_NOTE and NEXT_SEQUENCE_INDEX?
		playMidiNote(context.audioCtx, event.note, NOTE_DURATION);
	} else {
		throw Error(`Trying to play note with event type ${event.type}`);
	}
	return {
		presentingIndex: event.index,
	};
});

// TODO move this
const playMidiNote = (
	audioCtx: AudioContext,
	note: Midi,
	durationMs: number,
) => {
	const freq = midiToFreq(note, DEFAULT_TUNING);
	log('playNote', note, durationMs, freq);

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
};
