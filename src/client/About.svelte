<script>
	import ImgLink from './ImgLink.svelte';
	import Credits from './Credits.svelte';
	import CreditsPersonalSignature from './CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from './CreditsProjectSignature.svelte';
	import PortalLink from './PortalLink.svelte';

	/*

	TODO
	- make responsive - right now it only works for large screens

	*/
</script>

<section>
	<h1 class="title">cosmicplayground</h1>
	<h2 class="caption">tools and toys for expanding minds</h2>
</section>
<section>
	<p>
		<a href="https://www.cosmicplayground.org">cosmicplayground.org</a>
		is a collection of loosely related projects created by
		<a href="https://www.ryanatkn.com">Ryan Atkinson</a>.
		Hi that's me, I like making web things and apparently I have a thing for space? Everything
		here is free and
		<a href="https://github.com/ryanatkn/cosmicplayground">open source</a>
		and mostly a work-in-progress (fancy talk for half-broken or half-baked:). The first
		project that I think is worth sharing is
		<PortalLink name="deep-breath" />
		and there's hopefully more to come!
	</p>
	<div>
		<CreditsPersonalSignature />
	</div>
	<div>
		<CreditsProjectSignature />
	</div>
</section>
<section>
	<Credits />
</section>
<section>
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
</section>

<style>
	.title {
		font-size: 106px;
		white-space: nowrap;
	}
	.caption {
		text-align: center;
	}
	section {
		margin-bottom: 64px;
	}
	section:last-child {
		margin-bottom: 0;
	}
</style>
