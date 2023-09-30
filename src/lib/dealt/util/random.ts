import {browser} from '$app/environment';
import {create_random_alea} from '@grogarden/util/random_alea.js';
import {random_item, random_int} from '@grogarden/util/random.js';
import {derived, writable, type Readable, type Writable} from 'svelte/store';

// deterministic random numbers for deterministic builds and SSR
// more info: https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
export const seed: Writable<any[]> = writable(
	browser ? [Date.now()] : ['determinism', 'is', 'a', false],
);
export let random_float!: ToRandom;
export const random_seeded: Readable<ToRandom> = derived(
	[seed],
	($seed): ToRandom => create_random_alea(...$seed),
);
random_seeded.subscribe((r) => (random_float = r));

interface ToRandom {
	(): number;
}

// TODO might need another version that doesn't use a `Set` -- `random_items_with_duplicates`
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const random_items = <T>(items: T[], count: number, random = random_float) => {
	if (count >= items.length) return items;
	const results = new Set<T>();
	while (results.size < count) {
		results.add(random_item(items, random));
	}
	return Array.from(results);
};

// mutates `array` - clone first for immutability
export const shuffle: <T>(array: T[], random?: ToRandom) => T[] = (
	array,
	random = random_float,
) => {
	const len = array.length;
	const max = len - 1;
	for (let i = 0; i < len; i++) {
		const dest_index = random_int(0, max, random);
		if (i === dest_index) continue;
		const destItem = array[dest_index];
		array[dest_index] = array[i];
		array[i] = destItem;
	}
	return array;
};
