<script lang="ts">
	import LinkPath from '@feltcoop/felt/ui/LinkPath.svelte';

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
		<LinkPath>🌠</LinkPath>
		<h1>?????</h1>
		<button on:click={() => exit()}>resume</button>
	</div>
</Panel>
