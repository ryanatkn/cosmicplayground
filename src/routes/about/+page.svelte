<script lang="ts">
	import Panel from '$lib/app/Panel.svelte';
	import Credits from '$lib/portals/about/Credits.svelte';
	import CreditsProjectSignature from '$lib/portals/about/CreditsProjectSignature.svelte';
</script>

<header>
	<h1>
		<div class="header-content">
			cosmicplayground
			<a href="https://www.cosmicplayground.dev" class="cosm">
				<img
					src="/assets/characters/cosm.png"
					alt="icon for cosm, a little purple friend"
					class="pixelated image-button"
					width="16"
				/>
			</a>
		</div>
	</h1>
	<h2>tools and toys for expanding minds</h2>
</header>
<figure style:margin="var(--spacing_xl7) auto 0">
	<img src="/favicon.png" width="192" height="192" alt="cosmicplayground icon" />
</figure>
<div class="markup">
	<Panel>
		<h2>About</h2>
		<p>
			Cosmicplayground is a hobby project exploring some tools and toys using web technology for fun
			and learning. It's made with Svelte, SvelteKit, Vite, TypeScript, PixiJS, and <em>space</em>.
			Read on for the full credits.
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
			<a href="https://github.com/cosmicplayground/cosmicplayground">the source code</a> for more.
		</p>
	</Panel>
	<Panel>
		<CreditsProjectSignature />
		<div style="position: relative; cursor: none; height: 0">
			<img
				aria-hidden
				src="/assets/characters/spider.png"
				alt="spider"
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
	.cosm {
		position: absolute;
		right: -20px;
		height: 16px;
		width: 16px;
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
