<script lang="ts">
	import DeepBreath from './DeepBreath.svelte';
	import {getClock} from '$lib/app/clockStore';

	const clock = getClock();
</script>

<DeepBreath {clock} />
