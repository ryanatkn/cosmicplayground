<script lang="ts">
	import AppDialog from '$lib/app/AppDialog.svelte';
	import {showAppDialog} from '$lib/app/appDialog';

	const exit = () => {
		$showAppDialog = false;
	};
</script>

{#if $showAppDialog}
	<AppDialog {exit}><slot {exit} /></AppDialog>
{/if}
