<script>
	import ImgLink from './ImgLink.svelte';
	import CommunityLinks from './CommunityLinks.svelte';
	import Credits from './Credits.svelte';
	import {GR2i} from '../utils/math.js';

	export let name;

	/*

	ideas
	- make `{name}` responsive - right now it only works for large screens

	*/
	// TODO give this a max width (option to the Overlay wrapper component, probably)
</script>

<section class="flex">
	<h1 class="flex-1 pr-7"> {name} </h1>
	<div class="flex flex-col">
		<ImgLink
			src="assets/characters/patreon.png"
			alt="@ryanatkn on patreon"
			href="https://patreon.com/ryanatkn"
			imgClass="mix-blend-difference"
			imgStyle="width: 64px;" />
		<ImgLink
			src="assets/characters/twit.png"
			alt="@cpg_org on twitter"
			href="https://twitter.com/cpg_org"
			imgClass="mix-blend-difference"
			imgStyle="width: 64px;" />
	</div>
	<div>
		<ImgLink
			src="assets/characters/octocat.png"
			alt="@ryanatkn/cosmicplayground on github"
			href="https://github.com/ryanatkn/cosmicplayground"
			imgClass="mix-blend-difference" />
	</div>
</section>
<div>
	<em>tools and toys for expanding minds</em>
	<p>
		<em>current status:</em>
		there's barely anything here yet, but there's not _nothing_
	</p>
</div>
<CommunityLinks />
<slot />
<Credits />
<ImgLink
	href="https://spiderspace.org"
	src="assets/characters/spider.png"
	alt="spider"
	imgStyle="position: absolute; right: -14px; top: -5px;"
	linkStyle="display: block; position: relative; height: 0;" />
<ImgLink
	href="https://github.com/ryanatkn/cosmicplayground"
	src="assets/characters/cosm.png"
	alt="@ryanatkn/cosmicplayground on github"
	imgStyle="width: 100%;"
	imgClass="pixelated"
	linkStyle="display: block; width: {(100 * GR2i) | 0}%; margin: 0 auto;" />
