<script lang="ts">
	import Teleport from '@feltjs/felt-ui/Teleport.svelte';

	import {get_clock} from './clock';
	import {showAppDialog, appDialogEl} from './appDialog';

	const clock = get_clock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume();
	};
</script>

{#if $appDialogEl}<Teleport to={$appDialogEl}><slot {exit} /></Teleport>{/if}
