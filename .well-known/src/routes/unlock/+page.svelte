<script lang="ts">
	import {base} from '$app/paths';

	import AboutPortalPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/PortalPreview.svelte';
</script>

<div class="unlock">
	<section class="column box">
		<h1>
			unlock<img
				src="/assets/characters/spider.png"
				alt="spiderspace dot org"
				class="cursor-none"
				on:click={() => window.open('https://spiderspace.org/')}
				aria-hidden
			/>
		</h1>
		<aside class="width_sm">
			you made it, welcome. did you reach this place by playing the game? if so, wow. anyways,
		</aside>
		<ul class="prose">
			<!-- <li><a href="https://flat.cosmicplayground.org">flat.cosmicplayground.org</a></li> -->
			<li><a href="/unlock/studio">studio</a></li>
			<li><a href="/unlock/atlas">atlas</a></li>
		</ul>
	</section>

	<section>
		<PortalPreview href="{base}/about">
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
		margin-top: var(--space_xl7);
	}
</style>
