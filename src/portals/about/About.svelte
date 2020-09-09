<script>
	import Panel from '../../app/Panel.svelte';
	import ImgLink from '../../app/ImgLink.svelte';
	import Credits from './Credits.svelte';
	import CreditsPersonalSignature from './CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from './CreditsProjectSignature.svelte';
	import PortalLink from '../../app/PortalLink.svelte';

	/*

	TODO
	- make responsive - right now it only works for large screens

	*/
</script>

<header>
	<h1>cosmicplayground</h1>
	<h2>tools and toys for expanding minds</h2>
</header>
<Panel>
	<h2>About</h2>
	<p>
		<a href="https://www.cosmicplayground.org">cosmicplayground.org</a>
		is a collection of loosely related projects created by
		<a href="https://www.ryanatkn.com">Ryan Atkinson</a>.
		Hi that's me, I enjoy making web things and apparently I have a thing for space? Everything
		here is free and
		<a href="https://github.com/ryanatkn/cosmicplayground">open source</a>
		and mostly a work-in-progress (aka half-broken or half-baked:). The first project that I think
		is worth sharing is
		<PortalLink slug="deep-breath" />
		and there's hopefully more to come!
	</p>
	<hr />
	<div>
		<CreditsPersonalSignature />
	</div>
	<div>
		<CreditsProjectSignature />
	</div>
</Panel>
<Panel>
	<Credits />
</Panel>
<Panel>
	<h2>Contact</h2>
	<div>
		<CreditsPersonalSignature />
	</div>
	<div>
		<CreditsProjectSignature />
	</div>
	<ImgLink
		href="https://spiderspace.org"
		src="assets/characters/spider.png"
		alt="spider"
		imgClass="absolute t-8 -r-12"
		linkClass="block relative h-0 cursor-none"
	/>
</Panel>
<Panel>
	<h2>Privacy</h2>
	<p>
		This website tracks nothing and the only server it talks to is
		<a href="https://pages.github.com/">GitHub Pages</a>
		to serve all of the static content. (including images, HTML, CSS, JavaScript, audio.. am I
		forgetting anything?)
	</p>
</Panel>

<style>
	header {
		text-align: center;
	}
	h1 {
		font-size: 106px;
	}
</style>
