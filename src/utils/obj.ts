// TODO switch over to Gro versions -- there's an issue with optional properties though

export const omit = <T extends Partial<Record<K, any>>, K extends string | number>(
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

// A more explicit form of `{putThisFirst: obj.putThisFirst, ...obj}`
export const reorder = <T extends Partial<Record<K, any>>, K extends string | number>(
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
