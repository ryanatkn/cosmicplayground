<script>
	import ImgLink from './ImgLink.svelte';
	import Credits from './Credits.svelte';
	import {cls} from './sy.config.js';

	export let name;

	// initial test for class extraction helper
	// see the comments on the helper for more
	const headerClass = cls('pr-7');

	/*

	ideas
	- make `{name}` responsive - right now it only works for large screens

	*/
	// TODO give this a max width (option to the Panel wrapper component, probably)
</script>

<section class="flex">
	<h1 class="flex-1 {headerClass}" style="font-weight: 100; white-space: nowrap; font-size: 106px;">
		{name}
	</h1>
	<div class="flex flex-col">
		<ImgLink
			src="assets/characters/twit.png"
			alt="@cosmicplaygroun on twitter"
			href="https://twitter.com/cosmicplaygroun"
			linkClass="w-16"
			imgClass="mix-blend-difference"
		/>
	</div>
	<ImgLink
		src="assets/characters/octocat.png"
		alt="@ryanatkn/cosmicplayground on github"
		href="https://github.com/ryanatkn/cosmicplayground"
		linkClass="w-30"
		imgClass="mix-blend-difference"
		linkStyle="min-width: 24px;"
	/>
</section>
<div>
	<em>tools and toys for expanding minds</em>
	<p>
		source code at
		<a href="https://github.com/ryanatkn/cosmicplayground">github.com/ryanatkn/cosmicplayground</a>
	</p>
</div>
<slot />
<Credits />
<ImgLink
	href="https://spiderspace.org"
	src="assets/characters/spider.png"
	alt="spider"
	imgClass="absolute -t-1 -r-3"
	linkClass="block relative h-0 cursor-none"
/>
