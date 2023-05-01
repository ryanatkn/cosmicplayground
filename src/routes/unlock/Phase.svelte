<script lang="ts">
	import type {PhaseData} from '$routes/unlock/phases';

	export let phase: PhaseData;
	export let selected: boolean;
	export let disabled: boolean;
	export let select_phase: (phase: PhaseData) => void; // TODO events instead of callbacks?
</script>

<div class="phase" title="phase {phase.name}">
	<button
		on:click={() => {
			select_phase(phase);
		}}
		class:selected
		class:buttonish={!disabled}
		{disabled}
	>
		<div class="title">{phase.title}</div>
	</button>
</div>

<style>
	.phase {
		margin: 0 var(--spacing_xl);
	}
	.phase:first-child {
		margin-left: 0;
	}
	.phase:last-child {
		margin-right: 0;
	}
	button {
		position: relative;
		padding: var(--spacing_xl) var(--spacing_xl3);
	}
	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font_size_xl4);
		text-align: center;
		text-shadow: 2px 2px 3px #000;
	}
	@media (max-width: 1100px) {
		.title {
			font-size: var(--font_size_xl2);
		}
	}
	@media (max-width: 500px) {
		.title {
			font-size: var(--font_size_lg);
		}
	}
	/* TODO refactor to be global (there are conflicting styles in places) */
	.selected {
		color: var(--pending_color);
		border-color: var(--pending_color);
	}
</style>
