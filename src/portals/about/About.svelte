<script>
	import Panel from '../../app/Panel.svelte';
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
		cosmicplayground.org is a collection of loosely related projects created by <a
			href="https://www.ryanatkn.com"
		>Ryan Atkinson</a>. Hi that's me, I enjoy making web things and apparently I have a thing for
		space? Everything here is free and <a href="https://github.com/ryanatkn/cosmicplayground">open
			source</a> and mostly a work in progress. The first projects that I think are worth sharing are
		<PortalLink slug="deep-breath" />
		and
		<PortalLink slug="starlit-hammock" />, and there's hopefully more to come!
	</p>
	<hr />
	<CreditsPersonalSignature />
	<CreditsProjectSignature />
</Panel>
<Panel>
	<Credits />
</Panel>
<Panel>
	<h2>Privacy</h2>
	<p>
		This website tracks nothing and the only server it talks to is <a
			href="https://pages.github.com/"
		>GitHub Pages</a> to serve static files. It makes no third party network requests. See <a
			href="https://github.com/ryanatkn/cosmicplayground"
		>the source code</a> for more. Who are you???? I may never know.. maybe that's how it should be?
	</p>
</Panel>
<Panel>
	<h2>Contact</h2>
	<CreditsPersonalSignature />
	<CreditsProjectSignature />
	<a href="https://spiderspace.org" class="block relative h-0 cursor-none">
		<img src="/assets/characters/spider.png" alt="spider" class="absolute t-8 -r-12" />
	</a>
</Panel>

<style>
	header {
		text-align: center;
	}
	h1 {
		font-size: 106px;
	}
</style>
