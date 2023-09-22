<script lang="ts">
	import Teleport from '@fuz.dev/fuz/Teleport.svelte';
	import {get_clock} from '@ryanatkn/dealt/clock.js';

	import {show_app_dialog, appDialogEl} from '$lib/app/appDialog';

	const clock = get_clock();

	const exit = () => {
		$show_app_dialog = false;
		clock.resume();
	};

	// TODO rename to "main menu" ? is what we call it in the UI in the controls instructions
</script>

{#if $appDialogEl}<Teleport to={$appDialogEl}><slot {exit} /></Teleport>{/if}
