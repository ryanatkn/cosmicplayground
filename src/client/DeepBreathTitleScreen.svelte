<script>
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';

	import EarthThumbnail from './EarthThumbnail.svelte';
	import BackButton from './BackButton.svelte';
	import ResourcesLoadingProgress from './ResourcesLoadingProgress.svelte';
	import Panel from './Panel.svelte';
	import DeepBreathCredits from './DeepBreathCredits.svelte';
	import CreditsPersonalSignature from './CreditsPersonalSignature.svelte';
	import CreditsProjectSignature from './CreditsProjectSignature.svelte';

	export let resources;
	export let clock;
	export let proceed;

	// The user can click the title image to load the interactive,
	// but only if the user has clicked the load button directly before.
	// The information around the button is important for the user to understand
	// because the download size is so large.
	const HAS_LOADED_KEY = 'cpg__hasLoadedDeepBreath';
	let hasLoaded = !!localStorage.getItem(HAS_LOADED_KEY);
	$: enableLoadingByClickingTitleImage = hasLoaded;

	const load = async () => {
		await resources.load();
		if ($resources.status === AsyncState.Success) {
			if (!hasLoaded) localStorage.setItem(HAS_LOADED_KEY, 'true');
			proceed();
		}
	};

	const earthWidth = 600;
	const titleBorderWidth = 5; // TODO is a CSS var
</script>

<div class="back-button-wrapper">
	<BackButton />
</div>
<div class="deep-breath-title-screen">
	<div
		class="thumbnail"
		style="width: {earthWidth + titleBorderWidth * 2}px; height: {earthWidth / 2 + titleBorderWidth * 2}px;
		margin: 0 auto; border-radius: {earthWidth / 4}px; border-width: {titleBorderWidth}px;"
		role={enableLoadingByClickingTitleImage ? 'button' : undefined}
		aria-label={enableLoadingByClickingTitleImage ? 'proceed' : undefined}
		on:click={enableLoadingByClickingTitleImage ? load : undefined}
		class:clickable-to-load={enableLoadingByClickingTitleImage}
	>
		<EarthThumbnail
			width={earthWidth}
			height={earthWidth / 2}
			animationDuration="45s"
			running={$clock.running}
			fontSize={84}
			text="deep breath"
			styles="border-radius: {earthWidth / 4}px;"
		/>
	</div>
	<Panel>
		<section>
			<h2>If all ice on Earth melts, how will sea levels change?</h2>
			<p>
				Deep Breath is an interactive webpage with a rough sketch of Earth's sea levels if all ice
				melts, about 60-75 meters above 2020's oceans. Some estimates are higher. The code and image
				data are
				<a href="https://github.com/ryanatkn/cosmicplayground">open source on GitHub</a>
				. See the credits below for more.
			</p>
			<p>Please be aware that the data is imperfect. Some errors:</p>
			<ul>
				<li>The elevation data is imprecise and it may be inaccurate in some places.</li>
				<li>
					Ice remains visible when sea levels rise, even though sea level rise implies the ice has
					melted. This could be fixed by faking the revealed terrain.
				</li>
				<li>
					Landlocked areas below sea level fill with water even though they probably won't flood
					because they don't border the oceans. They could be misleading but I find them
					interesting. The most prominent examples are central Australia and the Aral Sea.
				</li>
			</ul>
			<p>
				<strong>This page is not mobile friendly!</strong>
				It probably won't work correctly on your phone. It may also be really slow depending on your
				hardware and browser. For my desktop on Windows, Firefox works well but Chrome and Edge are
				choppy, seemingly because they're shy about using more GPU resources. I plan to replace the
				rendering strategy soon with WebGL to improve performance.
			</p>
			<p>The download is about 75MB of images. If that's cool with you, click the button below!</p>
		</section>
		{#if $resources.status === AsyncState.Pending || $resources.status === AsyncState.Failure}
			<ResourcesLoadingProgress {resources} />
		{:else}
			<button class="big-button" on:click={load}>proceed with 75MB download</button>
		{/if}
		<hr />
		<section>
			<h2>Credits</h2>
			<DeepBreathCredits />
		</section>
		<hr />
		<section>
			<div>
				<CreditsPersonalSignature />
			</div>
			<div>
				<CreditsProjectSignature />
			</div>
		</section>
	</Panel>
</div>

<style>
	.deep-breath-title-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50px;
	}

	/* TODO this is mostly copy pasted from App.svelte, could clean up, maybe via a Thumbnail component */
	.thumbnail {
		position: relative;
		cursor: default;
		border-color: var(--ocean_color);
		display: flex;
		justify-content: center;
		align-items: center;
		animation: breathing-earth 6s ease-in-out infinite alternate;
	}

	.thumbnail.clickable-to-load:hover {
		border-style: double; /* TODO reusable class */
	}
	.thumbnail.clickable-to-load:active {
		border-style: dotted; /* TODO reusable class */
	}

	/* TODO restyle this thing */
	.big-button {
		/* TODO content sections should probably do this instead */
		margin: 30px auto 40px;
		display: block;
		background-color: transparent;
		color: var(--ocean_text_color);
		border-radius: 10px;
		border: 5px dashed var(--ocean_color);
	}
	.big-button:hover {
		border-style: double; /* TODO reusable class */
	}
	.big-button:active {
		border-style: dotted; /* TODO reusable class */
	}

	.back-button-wrapper {
		position: absolute;
		left: var(--hud-column-width);
		top: 0;
	}

	@keyframes breathing-earth {
		0% {
			transform: rotate3d(1, 0, 0, -30deg);
		}
		100% {
			transform: rotate3d(1, 0, 0, 30deg);
		}
	}
</style>
