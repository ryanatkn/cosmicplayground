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
		<button
			class:active={i === activeLandIndex}
			class:selected={i === selectedLandIndex}
			aria-label="select month {i + 1}"
			on:click={() => toggleIndex(i)}
			on:mouseenter={() => hoverLandIndex(i)}
			on:mouseleave={() => hoverLandIndex(null)}
		>
			{zodiacSymbol}
		</button>
	{/each}
</div>

<style>
	.zodiac {
		width: 100%;
		display: flex;
	}
	button {
		height: var(--hud_element_size);
		font-size: var(--font_size_lg);
		flex: 1;
		transition: opacity 0.15s linear;
		text-shadow: var(--text_shadow_sm);
		opacity: 0.4;
		border: none;
	}
	button:hover,
	button:focus {
		opacity: 0.7;
		transition-duration: 0s;
		text-shadow: var(--text_shadow_sm), 1px 1px 19px #000, 2px 2px #000;
	}
	button:active {
		text-shadow: -1px -1px 9px #000, -2px -2px 1px #000;
	}
	button.active {
		opacity: 1;
		border-bottom-color: transparent;
		transition-duration: 0s;
		text-shadow: -1px -1px 9px #000, -1px -1px 1px #000;
	}
	button.selected,
	.zodiac button.active:hover {
		border-bottom-color: #fff;
		text-shadow: -1px -1px 1px #000, 1px 1px 19px #000;
	}
	button.active:active {
		text-shadow: -1px -1px 7px #000, -2px -2px 1px #000;
	}
</style>
