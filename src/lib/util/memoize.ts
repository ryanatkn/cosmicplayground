export const memoize = <TKey, TValue>(
	cache: Map<TKey, TValue>,
	key: TKey,
	compute: () => TValue,
): TValue => {
	if (cache.has(key)) return cache.get(key)!;
	const value = compute();
	cache.set(key, value);
	return value;
};
