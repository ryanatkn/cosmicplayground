<script>
	import {intervalShortNames} from '../../music/intervals.js';

	// TODO this isn't being used any more

	export let level;
	export let select;

	// TODO high level input control abstraction - register through context?
	const indexByKey = {
		'1': 0,
		'2': 1,
		'3': 2,
		'4': 3,
		'5': 4,
		'6': 5,
		'7': 6,
		'8': 7,
		'9': 8,
		'0': 9,
		'-': 10,
		'=': 11,
	};
	const onDocumentKeyDown = e => {
		if (e.key in indexByKey) {
			const index = indexByKey[e.key];
			if (level.isInputDisabled($level, index)) return;
			select(index);
		}
	};
</script>

<div class="flex flex-col absolute t-0 l-0 w-50 h-full">

	{#each {length: 12} as _, index}
		<button
			class="flex-1 flex items-center justify-between w-full text-2xl px-8
			bg-transparent color-primary border"
			on:click={() => select(index)}
			disabled={level.isInputDisabled($level, index)}>
			<div>{index}</div>
			<div>{intervalShortNames[index]}</div>
		</button>
	{/each}

</div>

<svelte:window on:keydown={onDocumentKeyDown} />

<style>
	/* TOOD disabled styling should be global for this kind of button (as should the other styles) */
	button[disabled] {
		color: #777;
		border-color: #777;
	}
</style>
