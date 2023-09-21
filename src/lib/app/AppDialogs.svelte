<script lang="ts">
	import Dialog from '@feltjs/felt-ui/Dialog.svelte';
	import {getClock} from '@feltcoop/dealt';

	import {show_app_dialog, appDialogEl} from '$lib/app/appDialog';

	const clock = getClock();

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
