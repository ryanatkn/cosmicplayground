<script lang="ts">
	interface Props {
		daylight: number; // 0 to 1, where 1 is max light
		selected_daylight: number | null;
		select_daylight: (value: number | null) => void;
		hover_daylight: (value: number | null) => void;
	}

	const {daylight, selected_daylight, select_daylight, hover_daylight}: Props = $props();

	// TODO style when selected

	let daylight_el: HTMLElement | undefined = $state();

	const get_daylight = (y: number): number | null => {
		if (!daylight_el) return null;
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
	onmouseenter={(e) => hover_daylight(get_daylight(e.clientY))}
	onmousemove={(e) => hover_daylight(get_daylight(e.clientY))}
	onmouseleave={() => hover_daylight(null)}
>
	<div class="daylight-fill" style:height="{100 * daylight}%"></div>
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
