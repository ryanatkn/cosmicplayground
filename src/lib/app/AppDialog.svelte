<script lang="ts">
	import Teleport from '@feltcoop/felt/ui/Teleport.svelte';

	import {getClock} from '$lib/app/clock';
	import {showAppDialog, appDialogEl} from '$lib/app/appDialog';

	const clock = getClock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume();
	};
</script>

{#if $appDialogEl}<Teleport to={$appDialogEl}><slot {exit} /></Teleport>{/if}
