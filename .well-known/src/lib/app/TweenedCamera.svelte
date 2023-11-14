<script lang="ts">
	import {sineInOut} from 'svelte/easing';

	import type Camera from '$lib/app/Camera.svelte';
	import TweenedValue from '$lib/app/TweenedValue.svelte';

	export let camera: Camera;
	export let enabled = true;

	let {x, y, scale} = camera;
	$: ({x, y, scale} = camera);

	let tweenedX: TweenedValue<number>;
	let tweenedY: TweenedValue<number>;
	let tweenedScale: TweenedValue<number>;

	export const pan = async (
		xTarget: number,
		yTarget: number,
		duration: number,
		easing = sineInOut,
	): Promise<void> => {
		await Promise.all([
			tweenedX.update(xTarget, duration, easing),
			tweenedY.update(yTarget, duration, easing),
		]);
	};

	export const zoom = async (
		scaleTarget: number,
		duration: number,
		easing = sineInOut,
	): Promise<void> => tweenedScale.update(scaleTarget, duration, easing);

	export const resetTweens = (): void => {
		tweenedX.reset();
		tweenedY.reset();
		tweenedScale.reset();
	};
</script>

<TweenedValue value={x} {enabled} bind:this={tweenedX} />
<TweenedValue value={y} {enabled} bind:this={tweenedY} />
<TweenedValue value={scale} {enabled} bind:this={tweenedScale} />
