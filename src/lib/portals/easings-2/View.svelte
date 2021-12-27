<script lang="ts">
	import EasingAudViz from './EasingAudViz.svelte';
	import {get_clock} from '../../app/clockStore.js';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;

	const clock = get_clock();
</script>

<EasingAudViz {clock} />
