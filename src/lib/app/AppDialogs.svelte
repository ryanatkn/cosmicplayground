<script lang="ts">
	import Dialog from '@fuz.dev/fuz_dialog/Dialog.svelte';
	import {get_clock} from '$lib/clock.js';

	import {show_app_dialog, appDialogEl} from '$lib/app/appDialog';

	const clock = get_clock();

	const exit = () => {
		$show_app_dialog = false;
		clock.resume(); // TODO use a pause stack or something to safely unpause
	};
</script>

{#if $show_app_dialog}
	<!-- TODO better way to do this? -->
	<Dialog on:close={exit}><div class="dialogs" bind:this={$appDialogEl} /></Dialog>
{/if}

<style>
	.dialogs {
		display: flex;
		flex-direction: column;
	}
</style>
