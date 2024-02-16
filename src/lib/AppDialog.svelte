<script lang="ts">
	import Teleport from '@ryanatkn/fuz/Teleport.svelte';
	import {get_clock} from '$lib/clock.js';

	import {show_app_dialog, app_dialog_el} from '$lib/app_dialog';

	const clock = get_clock();

	const exit = () => {
		$show_app_dialog = false;
		clock.resume();
	};

	// TODO terribly hacky

	// TODO rename to "main menu" ? is what we call it in the UI in the controls instructions
</script>

{#if $app_dialog_el}<Teleport to={$app_dialog_el}><slot {exit} /></Teleport>{/if}
