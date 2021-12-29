<script lang="ts">
	import EasingAudViz from './EasingAudViz.svelte';
	import {getClock} from '$lib/app/clockStore';

	const clock = getClock();
</script>

<EasingAudViz {clock} />
