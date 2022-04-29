export const loadFromStorage = <T>(
	key: string,
	defaultValue: T,
	validate?: (value: any) => void,
): T => {
	const stored = localStorage.getItem(key);
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
	if (value === undefined) {
		localStorage.removeItem(key);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
};
