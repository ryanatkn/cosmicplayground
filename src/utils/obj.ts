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

export const omit = <
	T extends Partial<Record<K, any>>,
	K extends string | number
>(
	obj: T,
	keys: K[],
): OmitStrict<T, K> => {
	const result = {} as T;
	for (const key in obj) {
		// TODO type isn't perfect, but eh.
		// I think you have to trade off ergonomics at the callsite
		// and explicitly pass the key param? or mabye I'm missing something
		if (!keys.includes(key as any)) {
			result[key] = obj[key];
		}
	}
	return result;
};

export const omitUndefined = <
	T extends Partial<Record<K, any>>,
	K extends string | number
>(
	obj: T,
): T => {
	const result = {} as T;
	for (const key in obj) {
		const value = obj[key];
		if (value !== undefined) {
			result[key] = value;
		}
	}
	return result;
};

// A more explicit form of `{putThisFirst: obj.putThisFirst, ...obj}`
export const reorder = <
	T extends Partial<Record<K, any>>,
	K extends string | number
>(
	obj: T,
	keys: K[],
): T => {
	const result = {} as T;
	for (const k of keys) result[k] = obj[k];
	// overwriting is probably faster than using
	// a `Set` to track what's already been added
	for (const k in obj) result[k] = obj[k];
	return result;
};
