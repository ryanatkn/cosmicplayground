<script lang="ts">
	import Breadcrumbs from '@feltcoop/felt/ui/Breadcrumbs.svelte';

	import Panel from '$lib/app/Panel.svelte';
	import StarshipPreview from '$lib/portals/home/Preview.svelte';
	import AboutPreview from '$lib/portals/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';

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
	<div class="markup centered">
		<section>
			<Breadcrumbs>🌠</Breadcrumbs>
			<StarshipPreview
				onClick={() => {
					exit();
					toggleStarshipMode();
				}}
				{starshipMode}
			/>
		</section>
	</div>
</Panel><Panel
	><div class="markup centered">
		<section>
			<h2>controls</h2>
			<table>
				<thead><th>key</th><th>action</th></thead><tr
					><td><code>Escape</code></td><td>toggle main menu</td></tr
				><tr><td><code>`</code></td><td>toggle clock</td></tr>
			</table>
		</section>
	</div>
</Panel>
<PortalPreview href="/about">
	<AboutPreview />
</PortalPreview>

<style>
	/* TODO upstream */
	td {
		padding: var(--spacing_sm);
	}
	tr:hover {
		background-color: var(--bg_2);
	}
	h2 {
		text-align: center;
	}
	section {
		margin-bottom: var(--spacing_xl7);
	}
</style>
