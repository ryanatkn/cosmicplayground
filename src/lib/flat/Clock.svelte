<script lang="ts">
	import {get_clock} from '$lib/flat/clock';
	import PendingAnimation from '@fuz.dev/fuz_library/PendingAnimation.svelte';

	export let clock = get_clock();

	$: ({running} = $clock);
</script>

<button on:click={() => clock.toggle()}>
	<PendingAnimation {running} />
	<span class="icon"
		>{#if running}⏸{:else}▶️{/if}</span
	>
</button>

<style>
	button {
		flex-direction: column;
		font-size: var(--size_1);
	}
	.icon {
		font-size: var(--icon_size_lg);
	}
</style>
