<script>
	import EasingAudViz from './EasingAudViz.svelte';
	import {useClock} from '../../app/clockStore.js';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;

	const clock = useClock();
</script>

<EasingAudViz {clock} />
