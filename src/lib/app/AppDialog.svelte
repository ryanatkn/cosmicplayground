<script lang="ts">
	import Teleport from '@fuz.dev/fuz_library/Teleport.svelte';
	import {get_clock} from '$lib/flat/clock.js';

	import {show_app_dialog, appDialogEl} from '$lib/app/appDialog';

	const clock = get_clock();

	const exit = () => {
		$show_app_dialog = false;
		clock.resume();
	};

	// TODO rename to "main menu" ? is what we call it in the UI in the controls instructions
</script>

{#if $appDialogEl}<Teleport to={$appDialogEl}><slot {exit} /></Teleport>{/if}
