<script lang="ts">
	import {base} from '$app/paths';

	import AboutPortalPreview from '$routes/about/Preview.svelte';
	import PortalPreview from '$lib/PortalPreview.svelte';
	import Thanks from '$routes/unlock/Thanks.svelte';
	import Leaderboard from '$routes/unlock/Leaderboard.svelte';
</script>

<div class="unlock">
	<div class="column box">
		<h1>
			thank you!!<img
				class="spider"
				src="/assets/characters/spider.png"
				alt="spiderspace dot org"
				on:click={() => window.open('https://github.com/ryanatkn/fuz_template')}
				aria-hidden="true"
			/>
		</h1>
		<section>
			<Thanks />
		</section>
		<section>
			<Leaderboard />
		</section>
		<section>
			<aside class="width_sm">
				<p>
					You saved the crew! Unless you arrived here by looking at the code or just following a
					link? That's cool too, but if so, the crew is still in danger!
				</p>
				<p>
					This website has a multi-part game on the homepage. Completing the game leads here. The
					game is intentionally obscured but I plan to make some improvements so it's easier to
					understand what's happening.
				</p>
				<p>
					If you arrived here by playing the game, and you would like to be immortalized on the
					leaderboard above, send an email to mail at ryanatkn.com. Include the name you would like
					to have displayed, and I would also love to hear the story of how you saved the crew!
				</p>
			</aside>
		</section>
		<section>
			<ul>
				<!-- <li><a href="https://flat.cosmicplayground.org">flat.cosmicplayground.org</a></li> -->
				<li><a href="/unlock/atlas">atlas</a></li>
				<li><a href="/unlock/studio">studio</a></li>
			</ul>
		</section>
	</div>

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
		position: relative;
	}
	.unlock {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	ul {
		font-size: var(--size_xl3);
		align-items: center;
		text-align: center;
	}
	@media (max-width: 530px) {
		h1 {
			font-size: 70px;
		}
	}
	@media (max-width: 360px) {
		h1 {
			font-size: 50px;
		}
	}
	a {
		font-weight: 300;
	}
	p:not(:last-child) {
		/* TODO fuz_upgrade remove this */
		margin-bottom: 20px;
	}
	section {
		margin-bottom: var(--space_xl7);
	}
	.spider {
		position: absolute;
		right: 0.6rem;
		bottom: 2.8rem;
		cursor: none;
	}
</style>
