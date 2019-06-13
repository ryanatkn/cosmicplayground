// Iterated keys in `for..in` are always returned as strings,
// so to prevent usage errors the key type of `mapFn` is always a string.
// Symbols are not enumerable as keys, so they're excluded.
export const mapRecord = <T, K extends string | number, U>(
	obj: Record<K, T>,
	mapFn: (t: T, key: string) => U,
): Record<K, U> => {
	const result = {} as Record<K, U>;
	for (const key in obj) {
		result[key] = mapFn(obj[key], key);
	}
	return result;
};

// Applies default values to a base from left to right.
// Similar to `Object.assign` except all `undefined` partial values are ignored.
export const assignDefaults = <T>(
	defaults: T,
	...partials: (Partial<T> | undefined)[]
): T => {
	const result: T = {...defaults};
	for (const partial of partials) {
		for (const key in partial) {
			const value = partial[key];
			if (value !== undefined) (result as any)[key] = value; // TODO why is cast needed?
		}
	}
	return result;
};
