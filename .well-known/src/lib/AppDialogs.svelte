<script lang="ts">
	import Dialog from '@ryanatkn/fuz/Dialog.svelte';
	import {get_clock} from '$lib/clock.js';

	import {show_app_dialog, app_dialog_el} from '$lib/app_dialog';

	const clock = get_clock();

	const exit = () => {
		$show_app_dialog = false;
		clock.resume(); // TODO use a pause stack or something to safely unpause
	};
</script>

{#if $show_app_dialog}
	<!-- TODO hacky/buggy -->
	<Dialog on:close={exit}><div class="dialogs" bind:this={$app_dialog_el} /></Dialog>
{/if}

<style>
	.dialogs {
		display: flex;
		flex-direction: column;
	}
</style>
