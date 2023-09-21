<script lang="ts">
	import Teleport from '@feltjs/felt-ui/Teleport.svelte';
	import {getClock} from '@ryanatkn/dealt';

	import {show_app_dialog, appDialogEl} from '$lib/app/appDialog';

	const clock = getClock();

	const exit = () => {
		$show_app_dialog = false;
		clock.resume();
	};

	// TODO rename to "main menu" ? is what we call it in the UI in the controls instructions
</script>

{#if $appDialogEl}<Teleport to={$appDialogEl}><slot {exit} /></Teleport>{/if}
