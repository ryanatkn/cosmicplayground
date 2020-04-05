<script>
	import {onMount} from 'svelte/index.mjs';

	import {createLevelStore} from './levelStore.js';
	import PianoInstrument from '../music/PianoInstrument.svelte';
	import LevelProgressIndicator from './LevelProgressIndicator.svelte';
	import TrialProgressIndicator from './TrialProgressIndicator.svelte';
	import {useAudioCtx} from '../../audio/audioCtx.js';
	import {useMidiInput} from '../../audio/midiInput.js';

	/*

  TODO

	- MIDI input!!
	- orient people to their keyboard, maybe showing middle C?
		- related: consider rendering the PianoInstrument clamped to the tonic and octaveShift (validNotes) - problem is you might have a harder time arranging yourself on your keyboard
		- maybe always show the full keyboard? maybe always start at a C?
	- clamp level def data to the audible range
	- xstate!
	- what about supporting only a negative octave shift? changes the `tonicMax` calculation!
	- consider disabling input except for the tonic at first
  - show a histogram of the correct inputs lined up vertically  with the buttons, moving to the right from the left or fixed onscreen

  */
	export let levelDef;
	export let exitLevelToMap;

	let clientWidth; // `undefined` on first render

	const audioCtx = useAudioCtx();

	const level = createLevelStore(levelDef, audioCtx);
	// $: level.setDef(levelDef); // TODO update if levelDef prop changes

	$: highlightedKeys = $level.trial && new Set([$level.trial.sequence[0]]);
	$: console.log('highlighted', highlightedKeys);

	// emphasize middle C to make it easier to orient oneself on a MIDI keyboard
	const emphasizedKeys = new Set([60]);

	onMount(() => {
		level.send('START');
	});

	useMidiInput({
		onNoteStart: midi => {
			// TODO should this be ignored if it's not an enabled key? should the level itself ignore the guess?
			level.send({type: 'GUESS', midi});
		},
	});

	const reset = () => level.reset();

	const onDocumentKeyDown = e => {
		switch (e.key) {
			case 'r': {
				reset();
				break;
			}
			case ' ': {
				switch ($level.status) {
					case 'complete': {
						exitLevelToMap(true);
						break;
					}
				}
				break;
			}
			case '`': {
				level.guessCorrectly($level);
				break;
			}
			case 'Escape': {
				exitLevelToMap(); // TODO confirmation dialog
				break;
			}
		}
	};

	const onPressKey = midi => {
		console.log('press midi key', midi);
		level.send({type: 'GUESS', midi});
	};
</script>

<div class="absolute l-0 t-0 w-full h-full color-primary" bind:clientWidth>
	<!-- debugging -->
	<div
		class="text-2xl h-full w-full absolute t-0 l-0 flex items-center
		justify-center flex-col">
		<div>status: {$level.status}</div>
		<div>trials created: {$level.trials.length}</div>
		{#if $level.trial}
			<div>trial: {$level.trial.index + 1} of {$level.def.trialCount}</div>
			<div>retryCount: {$level.trial.retryCount}</div>
			{#if $level.trial.presentingIndex !== null}
				<div>
					presentingIndex: {$level.trial.sequence[$level.trial.presentingIndex]}
				</div>
			{:else}...{/if}
		{:else}no trial{/if}
	</div>
	<!-- /debugging -->

	<!-- {#if $level.status === 'presentingPrompt'}
	{:else if $level.status === 'waitingForInput'} -->
	{#if $level.status === 'showingSuccessFeedback'}
		<div class="absolute t-50 r-0 w-50 h-50" style="background-color: green;" />
	{:else if $level.status === 'showingFailureFeedback'}
		<div class="absolute t-50 r-0 w-50 h-50" style="background-color: red;" />
	{:else if $level.status === 'complete'}
		<button
			class="absolute t-50 r-0 w-50 h-25 text-3xl"
			on:click={exitLevelToMap}>
			return to the galaxy map
		</button>
	{/if}

	<div class="h-50 w-80 absolute r-0 t-0">
		<LevelProgressIndicator {level} />
	</div>
	<div class="h-50 w-80 absolute r-0 t-100">
		<TrialProgressIndicator {level} />
	</div>

	<div class="absolute l-0 b-0 w-100">
		{#if clientWidth}
			<PianoInstrument
				width={clientWidth}
				midiMin={$level.def.midiMin}
				midiMax={$level.def.midiMax}
				onPressKey={$level.status === 'waitingForInput' ? onPressKey : undefined}
				enabledKeys={$level.trial && $level.trial.validNotes}
				{highlightedKeys}
				{emphasizedKeys} />
		{/if}
	</div>
</div>

<svelte:window on:keydown={onDocumentKeyDown} />
