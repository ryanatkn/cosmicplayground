<svelte:options immutable={false} />

<script lang="ts">
	/*

  Svelte has built-in support for ergonomic and high performance animations.
  It includes a number of easing functions that transition your values from
  start to finish with a flair ranging from vanilla to satisfying to well past zany.
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

	import {createTweens, type Tween} from '$lib/tweens.js';
	import FloatingTextButton from '$lib/FloatingTextButton.svelte';

	let duration = 1500;

	let toggle = false;

	let timeout: number;
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

	type Easings_View = 'all' | 'selected' | 'unselected';
	const views: Easings_View[] = ['all', 'selected', 'unselected'];
	let view: Easings_View = 'selected';

	let playing = true;
	$: playing ? start_playing() : stop_playing();

	const tweens = createTweens(duration, undefined, 1);
	$: void tweens.set(toggle ? 1 : 0, {duration});

	let selected: {[key: string]: boolean};
	$: selected = tweens.easings.reduce((v = {}, {name}) => {
		if (!(name in v)) v[name] = true;
		return v;
	}, selected);

	$: selecting_all = Object.values(selected).every(Boolean);
	$: selecting_none = Object.values(selected).every((v) => !v);

	const graphic_width = 24;
	const graphic_height = 24;
	const translate_width = 300;
	const translate_distance = translate_width - graphic_width;

	const is_visible = (
		tween: Tween,
		selected: {[key: string]: boolean},
		view: Easings_View,
	): boolean => {
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

<section>
	<form class="box">
		<fieldset class="box row">
			<FloatingTextButton on:click={() => (playing = !playing)}>
				<div style:width="9rem">{playing ? 'pause' : 'play'}</div>
			</FloatingTextButton>
			<FloatingTextButton on:click={() => (toggle = !toggle)}>toggle</FloatingTextButton>
		</fieldset>
		<fieldset>
			<label>
				<div class="title">duration (ms)</div>
				<div class="row gap_sm">
					<input
						type="range"
						bind:value={duration}
						min={(2 * 1000) / 60}
						max={6000}
						step={1000 / 60}
					/>
					<input type="number" bind:value={duration} style:width="60px" />
				</div>
			</label>
		</fieldset>
		<fieldset class="row">
			<button type="button" on:click={select_all} disabled={selecting_all}>select all</button>
			<button type="button" on:click={select_none} disabled={selecting_none}>select none</button>
		</fieldset>
		<fieldset>
			<select bind:value={view}>
				{#each views as view (view)}
					<option value={view}>view {view}</option>
				{/each}
			</select>
		</fieldset>
	</form>
</section>
<section>
	{#each $tweens as item, i (item.name)}
		{#if is_visible(item, selected, view)}
			<div
				class="item"
				style:width="{translate_width}px"
				style:background-color={get_color(i, 0.16)}
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
					class="radius_xs3"
				/>
				<label class="item_label clickable" style:color={get_color(i)}>
					<input type="checkbox" bind:checked={selected[item.name]} />
					<span style:list-style={selected[item.name] ? 'circle' : 'none'}>{item.name}</span>
				</label>
			</div>
		{/if}
	{/each}
</section>

<style>
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
		padding: var(--space_xl);
		width: 100%;
		max-width: 550px;
		margin: 0 auto;
		color: rgba(255, 255, 255, 0.8);
	}
	input[type='checkbox'] {
		/* opacity: 0.8; */
		margin-right: 4px;
	}
	select {
		min-width: 150px;
		flex: 1;
	}
</style>
