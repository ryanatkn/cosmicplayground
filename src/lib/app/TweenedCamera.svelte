<script lang="ts">
	import {tweened, type Tweened} from 'svelte/motion';
	import {sineInOut} from 'svelte/easing';

	import type {Camera2} from '$lib/app/camera2';

	export let camera: Camera2;

	// TODO might be useful to decompose this into 3 of a component, like `TweenedValue`

	let {x, y, scale} = camera;
	$: ({x, y, scale} = camera);

	let xTween: Tweened<number> | null;
	let yTween: Tweened<number> | null;
	let scaleTween: Tweened<number> | null;
	$: if (xTween) $x = $xTween!; // TODO `!` because https://github.com/sveltejs/language-tools/issues/1341
	$: if (yTween) $y = $yTween!; // TODO `!` because https://github.com/sveltejs/language-tools/issues/1341
	$: if (scaleTween) $scale = $scaleTween!; // TODO `!` because https://github.com/sveltejs/language-tools/issues/1341

	export const updatePanTweens = async (
		xTarget: number,
		yTarget: number,
		duration: number,
		easing = sineInOut,
	): Promise<void> => {
		if (!xTween) xTween = tweened($x);
		if (!yTween) yTween = tweened($y);
		await Promise.all([
			xTween.set(xTarget, {duration, easing}),
			yTween.set(yTarget, {duration, easing}),
		]);
	};

	export const updateScaleTween = async (
		scaleTarget: number,
		duration: number,
		easing = sineInOut,
	): Promise<void> => {
		if (!scaleTween) scaleTween = tweened($scale);
		await scaleTween.set(scaleTarget, {duration, easing});
	};

	export const resetTweens = (): void => {
		xTween = null;
		yTween = null;
		scaleTween = null;
	};
</script>
