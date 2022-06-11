<script lang="ts">
	import Teleport from '@feltcoop/felt/ui/Teleport.svelte';

	import {getClock} from '$lib/app/clock';
	import {showAppDialog} from '$lib/app/appDialog';

	const clock = getClock();

	const exit = () => {
		$showAppDialog = false;
		clock.resume();
	};

	// TODO is prety hacky, find a better way
	let el: HTMLElement | undefined | null;
	$: setTimeout(() => (el = $showAppDialog ? document.getElementById('app-dialogs') : null));
</script>

{#if el}<Teleport to={el}><slot {exit} /></Teleport>{/if}
