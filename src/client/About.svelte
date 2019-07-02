<script>
	import ImgLink from './ImgLink.svelte';
	import CommunityLinks from './CommunityLinks.svelte';
	import Credits from './Credits.svelte';
	import {GR2i} from '../utils/math.js';
	import {cls} from './sy.config.js';

	export let name;

	// initial test for class extraction helper
	// see the comments on the helper for more
	const headerClass = cls('pr-7');

	/*

	ideas
	- make `{name}` responsive - right now it only works for large screens

	*/
	// TODO give this a max width (option to the Overlay wrapper component, probably)
</script>

<section class="flex">
	<h1 class="flex-1 {headerClass}"> {name} </h1>
	<div class="flex flex-col">
		<ImgLink
			src="assets/characters/patreon.png"
			alt="@ryanatkn on patreon"
			href="https://patreon.com/ryanatkn"
			linkClass="w-16"
			imgClass="mix-blend-difference" />
		<ImgLink
			src="assets/characters/twit.png"
			alt="@cpg_org on twitter"
			href="https://twitter.com/cpg_org"
			linkClass="w-16"
			imgClass="mix-blend-difference" />
	</div>
	<ImgLink
		src="assets/characters/octocat.png"
		alt="@ryanatkn/cosmicplayground on github"
		href="https://github.com/ryanatkn/cosmicplayground"
		linkClass="w-30"
		imgClass="mix-blend-difference" />
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
	imgClass="absolute -t-1 -r-3"
	linkClass="block relative h-0" />
<ImgLink
	href="https://github.com/ryanatkn/cosmicplayground"
	src="assets/characters/cosm.png"
	alt="@ryanatkn/cosmicplayground on github"
	imgClass="w-100 pixelated"
	linkClass="block mx-auto"
	linkStyle="width: {(100 * GR2i) | 0}%;" />
