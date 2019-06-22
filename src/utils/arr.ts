import {identity} from './fn';

// Like `range` but accepts a mapping `fn` instead of a min or step,
// like `Array.from` but with a nicer shorthand.
// If no `fn` is provided, the array's values match its index,
// e.g. `arrayOf(3) => [0, 1, 2]`
export const arrayOf = <T = number>(n: number, fn?: (n: number) => T): T[] => {
	// using `new Array(n)` and indices breaks tree shaking in rollup 1.15.6
	// and I can't find the right pure annotations to make it work,
	// so we just use a variable size array and `push` to it
	const result: any[] = [];
	for (let i = 0; i < n; i++) {
		result.push(fn ? /*@__PURE__*/ fn(i) : i);
	}
	return result;
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

export const last = <T>(arr: T[]): T => arr[arr.length - 1];
