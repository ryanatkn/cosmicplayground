<script lang="ts">
	import {get_clock} from '$lib/clock';
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';

	export let clock = get_clock();

	$: ({running} = $clock);
</script>

<button on:click={() => clock.toggle()}>
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
