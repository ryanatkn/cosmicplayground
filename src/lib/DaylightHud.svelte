<script lang="ts">
	export let daylight: number; // 0 to 1, where 1 is max light
	export let selected_daylight: number | null;
	export let select_daylight: (value: number | null) => void;
	export let hover_daylight: (value: number | null) => void;

	// TODO style when selected

	let daylight_el: HTMLElement;

	const get_daylight = (y: number): number => {
		const rect = daylight_el.getBoundingClientRect();
		const value = 1 - (y - rect.top) / (rect.bottom - rect.top);
		return value;
	};
</script>

<div
	class="daylight"
	bind:this={daylight_el}
	class:selected={selected_daylight !== null}
	onclick={(e) => select_daylight(selected_daylight === null ? get_daylight(e.clientY) : null)}
	aria-hidden="true"
	on:mouseenter={(e) => hover_daylight(get_daylight(e.clientY))}
	on:mousemove={(e) => hover_daylight(get_daylight(e.clientY))}
	on:mouseleave={() => hover_daylight(null)}
>
	<div class="daylight-fill" style="height: {100 * daylight}%;" />
</div>

<style>
	.daylight {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: var(--hud_element_size);
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		cursor: pointer;
	}
	.daylight-fill {
		width: 7px;
		background-color: var(--photon_color);
		position: absolute;
		opacity: 0.65;
		box-shadow:
			1px 0 2px 1px #000,
			2px 0 7px #000;
	}
	.selected .daylight-fill {
		box-shadow:
			-1px 0 2px 1px var(--photon_text_color),
			-2px 0 7px #000;
	}
	.daylight:active .daylight-fill {
		opacity: 1;
	}
</style>
