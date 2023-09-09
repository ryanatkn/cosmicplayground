<script lang="ts">
	import Panel from '$lib/app/Panel.svelte';
	import Credits from '$routes/about/Credits.svelte';
	import CreditsProjectSignature from '$routes/about/CreditsProjectSignature.svelte';
</script>

<header>
	<h1>
		<div class="header-content">cosmicplayground</div>
	</h1>
	<h2>tools and toys for expanding minds</h2>
</header>
<figure style:margin="var(--spacing_xl3) auto">
	<img src="/favicon.png" width="192" height="192" alt="cosmicplayground icon" />
</figure>
<div class="markup">
	<Panel>
		<h2>About</h2>
		<p>
			Cosmicplayground is a free and open source noncommercial hobby project exploring
			tools and toys using web tech for fun and learning.
			The <a
			href="https://github.com/ryanatkn/cosmicplayground">source code and assets</a
		> are on GitHub. It's made by
			<a href="https://www.ryanatkn.com">Ryan Atkinson</a>
			with <a href="https://svelte.dev/">Svelte</a>,
			<a href="https://kit.svelte.dev/">SvelteKit</a>, <a href="https://vitejs.dev/">Vite</a>,
			<a href="https://typescriptlang.org/">TypeScript</a>,
			<a href="https://pixijs.com/">PixiJS</a>, many freely licensed assets (see below), and
			<em>space</em>.
		</p>
	</Panel>
	<Panel>
		<CreditsProjectSignature />
	</Panel>
	<Credits />
	<Panel>
		<h2>Privacy</h2>
		<p>
			This website tracks nothing beyond <a href="https://pages.github.com/">GitHub Pages</a>
			serving static files. It has no server to store your data, and it makes no third party network
			requests. See
			<a href="https://github.com/ryanatkn/cosmicplayground">the source code</a> for more.
		</p>
	</Panel>
	<Panel>
		<h2>Package</h2>
		<p>
			This website depends on heaps of open source. Can't name it all too big. See
			<a href="https://github.com/ryanatkn/cosmicplayground/blob/main/package.json">package.json</a
			>.
		</p>
	</Panel>
	<Panel>
		<CreditsProjectSignature />
		<div style="position: relative; cursor: none; height: 0">
			<img
				aria-hidden
				src="/assets/characters/spider.png"
				alt="spiderspace dot org"
				style="position: absolute; bottom: -33px; right: -29px;"
				on:click={() => window.open('https://spiderspace.org')}
			/>
		</div>
	</Panel>
</div>

<style>
	header {
		text-align: center;
	}
	h1 {
		font-size: 106px;
		margin-top: 10px;
		display: flex;
		justify-content: center;
	}
	.header-content {
		position: relative;
	}
	.markup {
		margin-bottom: var(--spacing_xl9);
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
