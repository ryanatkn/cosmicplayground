<script lang="ts">
	export let daylight: number; // 0 to 1, where 1 is max light
	export let selectedDaylight: number | null;
	export let selectDaylight: (value: number | null) => void;
	export let hoverDaylight: (value: number | null) => void;

	// TODO style when selected

	let daylightEl: HTMLElement;

	const getDaylight = (y: number): number => {
		const rect = daylightEl.getBoundingClientRect();
		const height = rect.bottom - rect.top;
		const value = 1 - y / height;
		return value;
	};
</script>

<div
	class="daylight"
	bind:this={daylightEl}
	class:selected={selectedDaylight !== null}
	on:click={(e) => selectDaylight(selectedDaylight === null ? getDaylight(e.clientY) : null)}
	on:mouseenter={(e) => hoverDaylight(getDaylight(e.clientY))}
	on:mousemove={(e) => hoverDaylight(getDaylight(e.clientY))}
	on:mouseleave={() => hoverDaylight(null)}
>
	<div class="daylight-fill" style="height: {100 * daylight}%;" />
</div>

<style>
	.daylight {
		/* TODO make this not fixed */
		position: fixed;
		top: 0;
		right: 0;
		width: var(--hud_element_size);
		height: calc(100% - var(--hud_element_size)); /* TODO */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}
	.daylight-fill {
		width: 7px;
		background-color: var(--photon_color);
		position: absolute;
		opacity: 0.65;
		box-shadow: 1px 0 2px 1px #000, 2px 0 7px #000;
	}
	.selected .daylight-fill {
		box-shadow: -1px 0 2px 1px var(--ocean_text_color), -2px 0 7px #000;
	}
	.daylight:active .daylight-fill {
		opacity: 1;
	}
</style>
