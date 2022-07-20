<script lang="ts">
	import Dialog from '@feltcoop/felt/ui/dialog/Dialog.svelte';

	import {showAppDialog, appDialogEl} from '$lib/app/appDialog';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();

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
