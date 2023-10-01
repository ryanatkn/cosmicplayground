<script lang="ts">
	import Dialog from '@fuz.dev/fuz_dialog/Dialog.svelte';

	import {showAppDialog, appDialogEl} from '$lib/flat/appDialog';
	import {get_clock} from '$lib/flat/clock';

	const clock = get_clock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume(); // TODO use a pause stack or something to safely unpause
	};
</script>

{#if $showAppDialog}
	<!-- TODO better way to do this? -->
	<Dialog on:close={exit}><div class="dialogs" bind:this={$appDialogEl} /></Dialog>
{/if}

<style>
	.dialogs {
		display: flex;
		flex-direction: column;
	}
</style>
