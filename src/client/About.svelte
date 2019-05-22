<script>
	import CommunityLinks from './CommunityLinks.svelte';
	import Credits from './Credits.svelte';
	export let name;

	// TODO give this a max width (option to the Overlay wrapper component, probably)
</script>

<h1>{name}</h1>
<em>tools and toys for expanding minds: ear training, music theory, etc etc</em>
<p>
	<em>current status:</em>
	there's nothing here to see yet - just setting up and prototyping
</p>
<CommunityLinks />
<slot />
<Credits />
