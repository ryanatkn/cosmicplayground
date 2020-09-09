<script>
	import DeepBreath from './DeepBreath.svelte';
	import {useClock} from '../../app/clockStore.js';

	export const portal = undefined;
	export let width;
	export let height;
	// TODO alternate API? currently get the unfortunate console warning
	// https://github.com/sveltejs/svelte/issues/4652
	// (the workaround of `export const foo = null` doesn't work)
	// |
	// |
	// V
	// const {portalWidth, portalHeight} = portalStores();
	// const {width, height} = portalStores();
	// const {width, height} = usePortal();

	const clock = useClock();
</script>

<DeepBreath {clock} {width} {height} />
