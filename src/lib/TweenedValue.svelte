<script lang="ts">
	import {run} from 'svelte/legacy';

	import {tweened, type Tweened} from 'svelte/motion';
	import {sineInOut} from 'svelte/easing';
	import type {Writable} from 'svelte/store';

	type TValue = $$Generic;

	interface Props {
		value: Writable<TValue>;
		enabled?: boolean;
	}

	let {value, enabled = true}: Props = $props();

	let tween: Tweened<TValue> | null = $state();

	let lastTarget: TValue;
	let lastDuration: number;

	let lastEnabled = $state(enabled);
	const updateEnabled = (enabled: boolean): void => {
		if (!tween) return;
		if (enabled) {
			// set the previous targets
			void tween.set(lastTarget, {duration: lastDuration});
		} else {
			// freeze the tweens in place
			void tween.set($tween!, {duration: 0}); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
		}
	};

	export const update = (target: TValue, duration: number, easing = sineInOut): Promise<void> => {
		tween ??= tweened($value);
		lastTarget = target;
		lastDuration = duration;
		return tween.set(target, {duration, easing});
	};

	export const reset = (): void => {
		tween = null;
	};
	run(() => {
		if (tween && enabled) $value = $tween!;
	}); // TODO `!` because https://github.com/sveltejs/language-tools/issues/1341
	run(() => {
		if (enabled !== lastEnabled) {
			lastEnabled = enabled;
			updateEnabled(enabled);
		}
	});
</script>
