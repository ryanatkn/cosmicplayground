<script>
	import ImgLink from './ImgLink.svelte';
	import CommunityLinks from './CommunityLinks.svelte';
	import Credits from './Credits.svelte';
	export let name;

	/*

	ideas
	- make `{name}` responsive - right now it only works for large screens

	*/
	// TODO give this a max width (option to the Overlay wrapper component, probably)
</script>

<section style="display: flex;">
	<div style="flex: 1; padding-right: 30px;">
		<h1 style="margin: 0 0 10px; font-size: 55px;">{name}</h1>
		<em>
			tools and toys for expanding minds: ear training, music theory, etc etc
		</em>
		<p>
			<em>current status:</em>
			there's nothing here to see yet - just setting up and prototyping
		</p>
	</div>
	<div>
		<ImgLink
			src="assets/characters/octocat.png"
			alt="octocat"
			href="https://github.com/ryanatkn/cosmicplayground"
			imgStyle="mix-blend-mode: difference;" />
	</div>
</section>
<CommunityLinks />
<slot />
<Credits />
<ImgLink
	href="https://spiderspace.org"
	src="assets/characters/spider.png"
	alt="spider"
	imgStyle="position: absolute; right: -14px; top: -5px;"
	linkStyle="display: block; position: relative; height: 0;" />
