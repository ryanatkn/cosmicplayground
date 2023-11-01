<script lang="ts">
	import {get_clock} from '$lib/clock';
	import Pending_Animation from '@fuz.dev/fuz_library/Pending_Animation.svelte';

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
		font-size: var(--size_1);
	}
	.icon {
		font-size: var(--icon_size_lg);
	}
</style>
