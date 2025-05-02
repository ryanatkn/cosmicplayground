<script lang="ts">
	import { run } from 'svelte/legacy';

	import {sineInOut} from 'svelte/easing';

	import type Camera from '$lib/Camera.svelte';
	import TweenedValue from '$lib/TweenedValue.svelte';

	interface Props {
		camera: Camera;
		enabled?: boolean;
	}

	let { camera, enabled = true }: Props = $props();

	let {x, y, scale} = $state(camera);
	run(() => {
		({x, y, scale} = camera);
	});

	let tweenedX: TweenedValue<number> = $state();
	let tweenedY: TweenedValue<number> = $state();
	let tweenedScale: TweenedValue<number> = $state();

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
