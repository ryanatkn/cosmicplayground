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

export const setInStorage = (key: string, value: any): void => {
	console.log('setting', key, value);
	if (value === undefined) {
		localStorage.removeItem(key);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
};
