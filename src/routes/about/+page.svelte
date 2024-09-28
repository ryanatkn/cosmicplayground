<script lang="ts">
	import Panel from '$lib/Panel.svelte';
	import Favicon from '$routes/Favicon.svelte';
	import Credits from '$routes/about/Credits.svelte';
	import CreditsProjectSignature from '$routes/about/CreditsProjectSignature.svelte';
</script>

<header>
	<h1>
		<div class="header-content">cosmicplayground</div>
	</h1>
	<h2>tools and toys for expanding minds</h2>
</header>
<div style:margin-top="var(--space_xl3)" class="box">
	<Favicon size={192} />
</div>
<div class="box w_100">
	<div class="box width_md mb_xl9">
		<Panel>
			<h2>About</h2>
			<p>
				cosmicplayground.org is a free and open source noncommercial hobby project building tools
				and toys with web tech. The <a href="https://github.com/ryanatkn/cosmicplayground"
					>source code and assets</a
				>
				are on GitHub. It's made by
				<a href="https://www.ryanatkn.com">Ryan Atkinson</a>
				with <a href="https://svelte.dev/">Svelte</a>,
				<a href="https://kit.svelte.dev/">SvelteKit</a>, <a href="https://vitejs.dev/">Vite</a>,
				<a href="https://typescriptlang.org/">TypeScript</a>,
				<a href="https://pixijs.com/">PixiJS</a>, and the many freely licensed assets detailed
				below.
			</p>
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
		<div class="box">
			<Panel>
				<CreditsProjectSignature />
				<div style="position: relative; cursor: none; height: 0">
					<img
						aria-hidden="true"
						src="/assets/characters/spider.png"
						alt="spiderspace dot org"
						style="position: absolute; bottom: -33px; right: -29px;"
						onclick={() => window.open('https://github.com/ryanatkn/fuz_template')}
					/>
				</div>
			</Panel>
		</div>
	</div>
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
	h2 {
		margin-top: 0;
	}
	.header-content {
		position: relative;
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
