<script lang="ts">
	import Teleport from '@ryanatkn/fuz/Teleport.svelte';

	import {app_dialog_context} from '$lib/app_dialog.js';

	const app_dialog = app_dialog_context.get();
	const {app_dialog_el} = app_dialog;

	// TODO feels hacky to use Teleport but it allows a more composable pattern,
	// so there's a root app dialog in the main layout that any components can hook into

	// TODO rename to "main menu" ? is what we call it in the UI in the controls instructions
</script>

{#if $app_dialog_el}
	<Teleport to={$app_dialog_el}><slot exit={() => app_dialog.close()} /></Teleport>
{/if}
