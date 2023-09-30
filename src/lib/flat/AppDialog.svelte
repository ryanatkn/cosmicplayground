<script lang="ts">
	import Teleport from '@fuz.dev/fuz_library/Teleport.svelte';

	import {get_clock} from '$lib/flat/clock';
	import {showAppDialog, appDialogEl} from '$lib/flat/appDialog';

	const clock = get_clock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume();
	};
</script>

{#if $appDialogEl}<Teleport to={$appDialogEl}><slot {exit} /></Teleport>{/if}
