<script lang="ts">
	import PortalLink from '$lib/app/PortalLink.svelte';
	import {getClock} from '$lib/app/clock';
	import {freezeframe} from '$lib/app/freezeframe';

	const clock = getClock();

	$: freeze = !$clock.running;
</script>

<figure>
	<img
		alt="construction idea"
		src="/assets/construction/person-dig-idea.gif"
		use:freezeframe={freeze}
		width="48"
		height="48"
	/>
	<img
		alt="construction mammal"
		src="/assets/construction/mammal.gif"
		use:freezeframe={freeze}
		width="96"
		height="93"
	/>
	<figcaption>
		<PortalLink slug="under-construction" />
		gifs from
		<a href="http://textfiles.com/underconstruction/" style="word-break: break-word"
			>textfiles.com/underconstruction</a
		>, salvaged from Geocities by <a href="https://www.archiveteam.org/">Archive Team</a>
	</figcaption>
</figure>
