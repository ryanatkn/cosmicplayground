<script lang="ts">
	import Dialog from '@ryanatkn/fuz/Dialog.svelte';

	import {app_dialog_context} from '$lib/app_dialog.js';

	const app_dialog = app_dialog_context.get();
	const {show_app_dialog, app_dialog_el} = app_dialog;
</script>

{#if $show_app_dialog}
	<Dialog onclose={() => app_dialog.close()}>
		<div class="dialogs" bind:this={$app_dialog_el} />
	</Dialog>
{/if}

<style>
	.dialogs {
		display: flex;
		flex-direction: column;
	}
</style>
