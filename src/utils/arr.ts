import {identity} from './fn';

// Like `range` but accepts a mapping `fn` instead of a min or step.
// If no `fn` is provided, the array's values match its index,
// e.g. `arrayOf(3) => [0, 1, 2]`
export const arrayOf = <T = number>(n: number, fn = identity): T[] => {
	const r = new Array(n);
	for (let i = 0; i < n; i++) r[i] = fn(i);
	return r;
};

// TODO remove these when Edge catches up - https://caniuse.com/#feat=array-flat
export const flatMap = <T, U>(
	arr: T[],
	fn: (t: T, i: number) => U | U[],
): U[] => {
	const result: U[] = [];
	for (let i = 0; i < arr.length; i++) {
		const u = fn(arr[i], i);
		if (Array.isArray(u)) {
			for (const item of u) {
				result.push(item);
			}
		} else {
			result.push(u);
		}
	}
	return result;
};

export const flatten = <T>(arr: (T | T[])[]): T[] => flatMap(arr, identity);
