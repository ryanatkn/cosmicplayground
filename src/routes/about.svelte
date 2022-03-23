<script lang="ts">
	import Panel from '$lib/app/Panel.svelte';
	import Credits from '$lib/portals/about/Credits.svelte';
	import CreditsPersonalSignature from '$lib/portals/about/CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from '$lib/portals/about/CreditsProjectSignature.svelte';
	import PortalLink from '$lib/app/PortalLink.svelte';
</script>

<header>
	<h1>cosmicplayground</h1>
	<h2>tools and toys for expanding minds</h2>
</header>
<figure style:margin="var(--spacing_lg) auto 0">
	<img src="/favicon.png" alt="cosmicplayground icon" />
</figure>
<Panel>
	<div class="markup">
		<h2>About</h2>
		<p>
			cosmicplayground is a collection of loosely related projects created by <a
				href="https://www.ryanatkn.com">Ryan Atkinson</a
			>. Hi that's me, I enjoy making web things and apparently I have a thing for space? Everything
			here is free and <a href="https://github.com/ryanatkn/cosmicplayground">open source</a> and
			mostly a work in progress. The first projects that seem worth sharing are
			<PortalLink slug="soggy-planet" />
			and
			<PortalLink slug="starlit-hammock" />, and there's hopefully more to come!
			<a href="https://github.com/cosmicplayground"
				><img src="/assets/characters/cosm.png" alt="cosm" class="pixelated" width="16" />
			</a>
		</p>
		<hr />
		<CreditsPersonalSignature />
		<CreditsProjectSignature />
	</div>
</Panel>
<Panel>
	<Credits />
</Panel>
<Panel>
	<div class="markup">
		<h2>Privacy</h2>
		<p>
			This website tracks nothing and the only server it talks to is <a
				href="https://pages.github.com/">GitHub Pages</a
			>
			to serve static files. It makes no third party network requests. See
			<a href="https://github.com/ryanatkn/cosmicplayground">the source code</a> for more. Who are you????
			I may never know.. maybe that's how it should be?
		</p>
	</div>
</Panel>
<Panel>
	<div class="markup">
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
			margin-top: 20px;
		}
		header h2 {
			font-size: 32px;
		}
	}
	@media (max-width: 700px) {
		header h1 {
			font-size: 56px;
			margin-top: 30px;
		}
		header h2 {
			font-size: 24px;
		}
	}
	@media (max-width: 500px) {
		header h1 {
			font-size: 36px;
			font-weight: 300;
			margin-top: 40px;
		}
		header h2 {
			font-size: 20px;
		}
	}
	@media (max-width: 350px) {
		header h1 {
			font-size: 26px;
			font-weight: 500;
			margin-top: 50px;
		}
		header h2 {
			font-size: 16px;
		}
	}
</style>
