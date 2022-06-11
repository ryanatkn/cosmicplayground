<script lang="ts">
	import Teleport from '@feltcoop/felt/ui/Teleport.svelte';

	import {getClock} from '$lib/app/clock';
	import {showAppDialog} from '$lib/app/appDialog';

	const clock = getClock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume();
	};

	// TODO better way to do this? is prety hacky
	let el: HTMLElement | undefined | null;
	$: $showAppDialog, setTimeout(() => (el = document.getElementById('app-dialogs')));
</script>

{#if el}<Teleport to={el}><slot {exit} /></Teleport>{/if}
