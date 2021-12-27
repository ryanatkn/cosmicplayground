<script lang="ts">
	import DeepBreath from './DeepBreath.svelte';
	import {get_clock} from '$lib/app/clockStore.js';

	export const portal = undefined;
	export let width: number;
	export let height: number;
	// TODO alternate API? currently get the unfortunate console warning
	// https://github.com/sveltejs/svelte/issues/4652
	// (the workaround of `export const foo = null` doesn't work)
	// |
	// |
	// V
	// const {portalWidth, portalHeight} = portalStores();
	// const {width, height} = portalStores();
	// const {width, height} = usePortal();

	const clock = get_clock();
</script>

<DeepBreath {clock} {width} {height} />
