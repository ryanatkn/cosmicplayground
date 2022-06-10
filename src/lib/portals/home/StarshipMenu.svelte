<script lang="ts">
	import Breadcrumbs from '@feltcoop/felt/ui/Breadcrumbs.svelte';

	import Panel from '$lib/app/Panel.svelte';
	import StarshipPreview from '$lib/portals/home/Preview.svelte';

	export let exit: () => void;
	export let starshipMode: boolean;
	export let toggleStarshipMode: () => void;

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
		<StarshipPreview
			onClick={() => {
				exit();
				toggleStarshipMode();
			}}
			{starshipMode}
		/>
		<button on:click={() => exit()}>resume</button>
	</div>
</Panel>
