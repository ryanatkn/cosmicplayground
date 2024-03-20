<script lang="ts">
	/*

  Svelte has built-in support for ergonomic and high performance animations.
  It includes a number of easing functions that transition your values from
  start to finish with a flair ranging from vanilla to delightful to well past zany.
  This component visualizes the included easings
  using translate/rotate/scale CSS transforms.
  See the relevant section of Svelte's tutorial -
  https://svelte.dev/tutorial/tweened -
  which also links the Penner easing equations - http://robertpenner.com/easing/

	possible improvements
	- easily filter by "In", "Out", and "InOut"

  notes
  - there are some really weird visual artifacts when values are near 0
    in Chrome (both versions 74 on Windows and 73 on Linux), but not Firefox
  - when things are animating, the `select` input goes nuts in Firefox, but not Chrome
  - major optimizations could be made, probably
    - I'd be grateful for any pointers
    - I profiled the commented out code that uses `filteredTweens` below in Chrome,
      and it seems to use a lot more memory (like 50% more).
      The current and better performing version doesn't create a filtered collection,
      and instead uses `{#if is_visible(item)}`.
      The scripting/rendering/painting characteristics are similar in the two versions.
      I only profiled a handful of times for ~20 seconds,
      and I don't have much experience profiling, so I could be wrong about everything.
  - what could be more idiomatic or clear?

  */

	import {onDestroy} from 'svelte';

	import {createTweens, type Tween} from '$lib/tweens';
	import FloatingTextButton from '$lib/FloatingTextButton.svelte';

	let duration = 1500;

	let toggle = false;

	let timeout: any;
	const loop_padding = 300; // time to wait between loops
	const loop = (time: number): void => {
		timeout = setTimeout(() => {
			toggle = !toggle;
			loop(duration + loop_padding);
		}, time);
	};
	const start_playing = () => loop(0);
	const stop_playing = () => clearTimeout(timeout);
	onDestroy(stop_playing);

	const views = ['all', 'selected', 'unselected'];
	let view = 'selected';

	let playing = true;
	$: playing ? start_playing() : stop_playing();

	const tweens = createTweens(duration, undefined, 1);
	$: void tweens.set(toggle ? 1 : 0, {duration});

	let selected: {[key: string]: boolean};
	$: selected = tweens.easings.reduce((v = {}, {name}) => {
		if (!(name in v)) v[name] = true;
		return v;
	}, selected);

	const graphic_width = 24;
	const graphic_height = 24;
	const translate_width = 300;
	const translate_distance = translate_width - graphic_width;

	const is_visible = (tween: Tween): boolean => {
		switch (view) {
			case 'all':
				return true;
			case 'selected':
				return selected[tween.name];
			case 'unselected':
				return !selected[tween.name];
			default:
				throw Error();
		}
	};
	const get_color = (index: number, opacity = 0.8) =>
		`hsla(${index * 75}deg, 60%, 65%, ${opacity})`;

	const select_all = () => {
		selected = Object.fromEntries(Object.entries(selected).map(([k]) => [k, true]));
	};
	const select_none = () => {
		selected = Object.fromEntries(Object.entries(selected).map(([k]) => [k, false]));
	};
</script>

<section class="controls">
	<div class="controls_group">
		<FloatingTextButton on:click={() => (playing = !playing)}>
			<div style:width="9rem">{playing ? 'pause' : 'play'}</div>
		</FloatingTextButton>
		<FloatingTextButton on:click={() => (toggle = !toggle)}>toggle</FloatingTextButton>
	</div>
	<div class="controls_group">
		<input type="range" bind:value={duration} min={(2 * 1000) / 60} max={6000} step={1000 / 60} />
		<div class="pl-2">
			<div>{Math.round(duration)}<small>ms</small></div>
			<small>duration</small>
		</div>
	</div>
	<div class="controls_group">
		<select class="pl-2" bind:value={view}>
			{#each views as view (view)}
				<option value={view}>view {view}</option>
			{/each}
		</select>
		<button on:click={select_all}>select all</button>
		<button on:click={select_none}>select none</button>
	</div>
</section>

<section>
	{#each $tweens as item, i (item.name)}
		{#if is_visible(item)}
			<div
				class="item"
				style:width="{translate_width}px"
				style:background-color={get_color(i, 0.1)}
			>
				<div
					class="item_graphic_scale"
					style:transform="scale3d({item.value}, {item.value}, 1)"
					style:width="{graphic_width}px"
					style:height="{graphic_height}px"
					style:background-color={get_color(i)}
				/>
				<div
					class="item_graphic_rotate"
					style:transform="rotate({item.value * 180}deg)"
					style:height="{graphic_height}px"
					style:background-color={get_color(i)}
				/>
				<div
					style:transform="translate3d({item.value * translate_distance}px, 0, 0)"
					style:width="{graphic_width}px"
					style:height="{graphic_height}px"
					style:background-color={get_color(i)}
				/>
				<label class="item_label" style:color={get_color(i)}>
					<input type="checkbox" bind:checked={selected[item.name]} />
					<span style:list-style={selected[item.name] ? 'circle' : 'none'}>{item.name}</span>
				</label>
			</div>
		{/if}
	{/each}
</section>

<style>
	.controls {
		display: flex;
		flex-direction: column;
	}
	.controls_group {
		display: flex;
		align-items: center;
	}
	.item {
		position: relative;
		display: flex;
		margin-top: 6px;
	}
	.item_graphic_rotate {
		position: absolute;
		right: -180px;
		top: 0;
		width: 3px;
		transform-origin: middle;
	}
	.item_graphic_scale {
		position: absolute;
		right: -230px;
		top: 0;
		border-radius: 50%;
		transform-origin: middle;
	}
	.item_label {
		position: absolute;
		left: 100%;
		top: 0;
		padding-left: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-weight: bold;
	}
	.item_label input[type='checkbox'] {
		visibility: hidden;
	}
	.item_label span {
		display: list-item;
	}
	section {
		padding: 15px 15px 15px 60px;
		width: 550px;
		margin: 0 auto;
		color: rgba(255, 255, 255, 0.8);
	}
	input[type='range'] {
		width: 300px;
	}
	input[type='checkbox'] {
		opacity: 0.8;
		margin-right: 4px;
	}
	select {
		min-width: 150px;
		height: 40px;
		flex: 1;
	}
</style>
