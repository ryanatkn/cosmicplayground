<script lang="ts">
	import {get_clock} from './clock';
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
		font-size: var(--font_size_xl);
	}
	.icon {
		font-size: var(--icon_size_lg);
	}
</style>
