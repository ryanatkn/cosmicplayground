<script lang="ts">
	import AboutPortalPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
</script>

<div class="unlock">
	<section class="column box">
		<h1>
			unlock<img
				src="/assets/characters/spider.png"
				alt="spiderspace dot org"
				class="cursor-none"
				on:click={() => window.open('https://spiderspace.org')}
				aria-hidden
			/>
		</h1>
		<aside>
			you made it, welcome. did you reach this place by rescuing the crew all at once in the actual
			game? if so, wow, that sounds like it deserves a reward. anyway, I should program something to
			continue that gameplay seamlessly (and improve the initial experience, it's at the stage where
			a little can go a long way) in the meantime, you can click the links below to see some
			previews:
		</aside>
		<ul class="prose">
			<!-- <li><a href="https://flat.cosmicplayground.org">flat.cosmicplayground.org</a></li> -->
			<li><a href="/unlock/studio">studio</a></li>
			<li><a href="/unlock/atlas">atlas</a></li>
		</ul>
	</section>

	<section>
		<PortalPreview href="/about">
			<AboutPortalPreview />
		</PortalPreview>
	</section>
</div>

<style>
	h1 {
		font-size: 100px;
		text-align: center;
	}
	.unlock {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	ul {
		font-size: var(--size_xl3);
	}
	@media (max-width: 530px) {
		ul {
			font-size: var(--size_xl);
		}
	}
	ul {
		align-items: center;
		text-align: center;
	}
	a {
		font-weight: 300;
	}
	section {
		margin-top: var(--spacing_xl7);
	}
</style>
