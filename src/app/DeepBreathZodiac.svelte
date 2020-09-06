<script>
	export let activeLandIndex;
	export let selectedLandIndex;
	export let selectLandIndex;
	export let hoverLandIndex;

	const zodiac = [
		'♑︎',
		'♒︎',
		'♓︎',
		'♈︎',
		'♉︎',
		'♊︎',
		'♋︎',
		'♌︎',
		'♍︎',
		'♎︎',
		'♏︎',
		'♐︎',
	];
	const toggleIndex = (index) => {
		selectLandIndex(selectedLandIndex === index ? null : index);
	};
</script>

<div class="zodiac">
	{#each zodiac as zodiacSymbol, i (zodiacSymbol)}
		<div
			class="clickable"
			class:clickable--active={i === activeLandIndex}
			class:selected={i === selectedLandIndex}
			role="button"
			aria-label="select month {i + 1}"
			on:click={() => toggleIndex(i)}
			on:mouseenter={() => hoverLandIndex(i)}
			on:mouseleave={() => hoverLandIndex(null)}
		>
			{zodiacSymbol}
		</div>
	{/each}
</div>

<style>
	.zodiac {
		width: 100%;
		display: flex;
	}
	.zodiac .clickable {
		height: var(--hud-column-width);
		flex: 1;
		transition: opacity 0.15s linear;
	}
	.zodiac .clickable:hover {
		transition-duration: 0s;
	}
	.zodiac .clickable.clickable--active {
		/* the border is a bit too heavy and choppy an animation */
		border-bottom-color: transparent;
		transition-duration: 0s;
	}
	.zodiac .clickable.selected,
	.zodiac .clickable.clickable--active:hover {
		border-bottom-color: #fff;
	}
</style>
