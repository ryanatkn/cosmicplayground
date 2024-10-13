<script lang="ts">
	import {clock_context, type ClockStore} from '$lib/clock.js';
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';

	interface Props {
		clock?: ClockStore;
	}

	const {clock = clock_context.get()}: Props = $props();

	const {running} = $derived($clock);
</script>

<button type="button" onclick={() => clock.toggle()}>
	<Pending_Animation {running} />
	<span class="icon"
		>{#if running}⏸{:else}▶️{/if}</span
	>
</button>

<style>
	button {
		flex-direction: column;
		font-size: var(--size_xl);
	}
	.icon {
		font-size: var(--icon_size_lg);
	}
</style>
