<script lang="ts">
	import Breadcrumbs from '@feltcoop/felt/ui/Breadcrumbs.svelte';

	import Panel from '$lib/app/Panel.svelte';

	export let exit: () => void;

	// TODO BLOCK
	/*

	what should the API for the main menu be like?

	maybe `MainDialogMenuEntry` or `MenuEntry` or something
	could be a component that could be mounted anywhere,
	and adds its contents to the main dialog menu

	*/
</script>

<Panel>
	<div class="markup">
		<Breadcrumbs>🌠</Breadcrumbs>
		<h1>?????</h1>
		<button on:click={() => exit()}>resume</button>
	</div>
</Panel>
