<script lang="ts">
	import Dialog from '@ryanatkn/fuz/Dialog.svelte';

	import {get_app_dialog} from '$lib/app_dialog';

	const app_dialog = get_app_dialog();
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
