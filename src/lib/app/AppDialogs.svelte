<script lang="ts">
	import Dialog from '@feltcoop/felt/ui/dialog/Dialog.svelte';

	import {showAppDialog} from '$lib/app/appDialog';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume(); // TODO use a pause stack or something to safely unpause
	};
</script>

{#if $showAppDialog}
	<!-- TODO better way to do this? -->
	<Dialog on:close={exit}><div id="app-dialogs" /></Dialog>
{/if}
