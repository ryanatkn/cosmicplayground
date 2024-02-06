<script lang="ts">
	import {tweened, type Tweened} from 'svelte/motion';
	import {sineInOut} from 'svelte/easing';
	import type {Writable} from 'svelte/store';

	type TValue = $$Generic;

	export let value: Writable<TValue>;
	export let enabled = true;

	let tween: Tweened<TValue> | null;
	$: if (tween && enabled) $value = $tween!; // TODO `!` because https://github.com/sveltejs/language-tools/issues/1341

	let lastTarget: TValue;
	let lastDuration: number;

	let lastEnabled = enabled;
	$: if (enabled !== lastEnabled) {
		lastEnabled = enabled;
		updateEnabled(enabled);
	}
	const updateEnabled = (enabled: boolean): void => {
		if (!tween) return;
		if (enabled) {
			// set the previous targets
			void tween.set(lastTarget, {duration: lastDuration});
		} else {
			// freeze the tweens in place
			void tween.set($tween as unknown as any, {duration: 0});
		}
	};

	export const update = (target: TValue, duration: number, easing = sineInOut): Promise<void> => {
		if (!tween) tween = tweened($value);
		lastTarget = target;
		lastDuration = duration;
		return tween.set(target, {duration, easing});
	};

	export const reset = (): void => {
		tween = null;
	};
</script>
