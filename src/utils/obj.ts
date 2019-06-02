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
