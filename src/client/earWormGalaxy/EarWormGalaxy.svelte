<script>
	/*

  TODO
  - don't render the background after transitioning to full screen
  - how to teach? maybe show visuals for the first couple levels? or the first few rounds of the first few levels?

  */

	import {levelDefs} from './levelDefs.js';
	import {createLevelStatsStore} from './levelStatsStore.js';
	import Level from './Level.svelte';
	import MapLevelIcon from './MapLevelIcon.svelte';
	import {useAudioCtx} from '../../audio/audioCtx.js';
	import {provideMidiInput} from '../../audio/midiInput.js';

	console.log('levelDefs', levelDefs);

	let activeLevelDef = null; // TODO initialize to undefined

	let levelStats = createLevelStatsStore(levelDefs);
	$: console.log('stats', $levelStats);
	console.log($levelStats);

	const audioCtx = useAudioCtx();
	window['audio'] = audioCtx;

	const selectLevelDef = levelDef => {
		audioCtx.resume(); // TODO where's the best place for this? needs to be synchronous with a click or similar, so this breaks if `selectLevelDef` is called without a user action
		activeLevelDef = levelDef;
	};

	const exitLevelToMap = (success = false) => {
		if (success) {
			levelStats.registerSuccess(activeLevelDef.id);
		}
		// TODO do we actually want to replace this with a statechart?
		// so the active level is a nested machine?
		activeLevelDef = null;
	};

	const midiAccess = provideMidiInput();

	const initMidi = async () => {
		// TODO how to call this better? needs to be a user-initiated action right?
		// do we need to present a screen to users that lets them opt into midi?
		try {
			await midiAccess.requestMidiAccess();
			midiAccess.initInputs();
		} catch (err) {
			console.log('failed to request MIDI access', err);
			alert('failed to request MIDI access: ' + err.message);
		}
		console.log('MIDI ready!');
	};
</script>

<div class="h-full w-full">
	{#if activeLevelDef}
		<Level levelDef={activeLevelDef} {exitLevelToMap} />
	{:else}
		<img
			class="w-auto h-auto max-width-none"
			alt="UGC 2885"
			src="assets/space/heic2002a.jpg" />
		<div>
			{#each levelDefs as levelDef}
				<MapLevelIcon
					{levelDef}
					select={selectLevelDef}
					isComplete={$levelStats.isComplete[levelDef.id]} />
			{/each}
		</div>
		<button on:click={initMidi} class="absolute l-0 t-0">init MIDI</button>
	{/if}
</div>

<style>
	/* TODO this shouldn't be rendered at all */
	:global(.bg) {
		display: none;
	}
</style>
