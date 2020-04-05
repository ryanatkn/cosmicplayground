<script>
	import {midiNaturals} from '../../music/notes.js';

	export let midi; // Midi
	export let leftOffset; // number
	export let width; // number
	export let height; // number
	export let isEnabled = true; // ?boolean
	export let isHighlighted = false; // ?boolean
	export let isEmphasized = false; // ?boolean
	export let onPress = undefined; // ?(midi: Midi): void

	const doPress = () => {
		if (onPress) onPress(midi);
	};
</script>

<div
	class="key {midiNaturals[midi] ? 'white' : 'black'}"
	class:disabled={!isEnabled}
	class:clickable={onPress && isEnabled}
	class:highlighted={isHighlighted}
	class:emphasized={isEmphasized}
	on:click={isEnabled ? doPress : undefined}
	style="width: {width}px; height: {height}px; left: {leftOffset}px;" />

<style>
	.key {
		/* TODO move these */
		--white-key-color: #fff;
		--black-key-color: #333;
		--white-key-disabled-color: #999;
		--black-key-disabled-color: #777;
		--border-color: rgba(0, 0, 0, 0.22);
		--primary-color: #00bb00;
		--primary-color-dark: #007700;
		--highlighted-key-color: rgb(46, 114, 241);

		position: absolute;
		top: 0;
		border-left: 1px solid var(--border-color);
		border-top: 1px solid var(--border-color);
		border-bottom: 1px solid var(--border-color);
	}

	.key:last-child {
		border-right: 1px solid var(--border-color);
	}

	.clickable {
		cursor: pointer;
	}
	.clickable:hover {
		background-color: var(--primary-color);
	}
	.clickable:active {
		background-color: var(--primary-color-dark);
	}

	.white {
		background-color: var(--white-key-color);
		z-index: 1;
	}
	.black {
		background-color: var(--black-key-color);
		z-index: 2;
	}

	.highlighted {
		background-color: var(--highlighted-key-color);
	}

	.disabled {
		cursor: default;
	}

	.white.disabled,
	.white.disabled:hover,
	.white.disabled:active {
		background-color: var(--white-key-disabled-color);
	}
	.black.disabled,
	.black.disabled:hover,
	.black.disabled:active {
		background-color: var(--black-key-disabled-color);
	}

	.emphasized::before {
		display: block;
		position: relative;
		left: 0;
		top: -30px;
		content: '';
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: rgb(243, 211, 159);
	}
</style>
