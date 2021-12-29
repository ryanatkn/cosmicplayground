<script lang="ts">
	import Panel from '$lib/app/Panel.svelte';
	import Credits from './Credits.svelte';
	import CreditsPersonalSignature from './CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from './CreditsProjectSignature.svelte';
	import PortalLink from '$lib/app/PortalLink.svelte';

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
			href="https://www.ryanatkn.com">Ryan Atkinson</a
		>. Hi that's me, I enjoy making web things and apparently I have a thing for space? Everything
		here is free and <a href="https://github.com/ryanatkn/cosmicplayground">open source</a> and
		mostly a work in progress. The first projects that I think are worth sharing are
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
			href="https://pages.github.com/">GitHub Pages</a
		>
		to serve static files. It makes no third party network requests. See
		<a href="https://github.com/ryanatkn/cosmicplayground">the source code</a> for more. Who are you????
		I may never know.. maybe that's how it should be?
	</p>
</Panel>
<Panel>
	<h2>Contact</h2>
	<CreditsPersonalSignature />
	<CreditsProjectSignature />
	<div style="position: relative; cursor: none; height: 0">
		<img
			src="/assets/characters/spider.png"
			alt="spider"
			style="position: absolute; bottom: -33px; right: -29px;"
			on:click={() => window.open('https://www.spiderspace.org')}
		/>
	</div>
</Panel>

<style>
	header {
		text-align: center;
	}
	h1 {
		font-size: 106px;
		margin-top: 10px;
	}
	@media (max-width: 900px) {
		header h1 {
			font-size: 80px;
		}
		header h2 {
			font-size: 32px;
		}
	}
	@media (max-width: 700px) {
		header h1 {
			font-size: 56px;
		}
		header h2 {
			font-size: 24px;
		}
	}
	@media (max-width: 500px) {
		header h1 {
			font-size: 36px;
			font-weight: 300;
		}
		header h2 {
			font-size: 20px;
		}
	}
	@media (max-width: 350px) {
		header h1 {
			font-size: 26px;
			font-weight: 500;
		}
		header h2 {
			font-size: 16px;
		}
	}
</style>
