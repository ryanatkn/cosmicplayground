<script lang="ts">
	export let activeLandIndex: number; // active is the hover state or "current" when automatically cycling
	export let selectedLandIndex: number; // selected is the "current" non-cycling state (confusing yes)
	export let selectLandIndex: (value: number | null) => void;
	export let hoverLandIndex: (value: number | null) => void;

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
	const toggleIndex = (index: number) => {
		selectLandIndex(selectedLandIndex === index ? null : index);
	};
</script>

<div class="zodiac-hud">
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
	.zodiac-hud {
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
	button.active {
		opacity: 1;
		transition-duration: 0s;
		text-shadow: var(--text_shadow_sm);
	}
	button:active {
		opacity: 0.7;
		text-shadow: var(--text_shadow_reverse_sm);
	}
	button.selected,
	button.active:active {
		text-shadow: var(--text_shadow_reverse_sm);
	}
	button.selected:active {
		text-shadow: var(--text_shadow_sm);
	}
</style>
