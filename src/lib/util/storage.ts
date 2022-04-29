/**
 * Loads `key` and falls back to `defaultValue`.
 * If `validate` is provided and throws, it removes the `key` and returns `undefined`.
 * @param key
 * @param defaultValue
 * @param validate
 * @returns
 */
export const loadFromStorage = <T>(
	key: string,
	defaultValue: T,
	validate?: (value: any) => asserts value is T,
): T => {
	const stored = localStorage.getItem(key);
	console.log('loading', key, stored);
	if (!stored) return defaultValue;
	try {
		const parsed = JSON.parse(stored);
		validate?.(parsed);
		return parsed;
	} catch (err) {
		localStorage.removeItem(key);
		return defaultValue;
	}
};

/**
 * Sets `value` at `key`.
 * Importantly, if `value` is `undefined` the `key` is removed,
 * but a `value` of `null` is stored.
 * @param key
 * @param value
 */
export const setInStorage = (key: string, value: any): void => {
	console.log('setting', key, value);
	if (value === undefined) {
		localStorage.removeItem(key);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
};
