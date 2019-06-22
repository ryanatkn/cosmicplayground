export const truncate = (
	str: string,
	maxLength: number,
	suffix = '...',
): string => {
	if (str.length > maxLength) {
		return str.slice(0, maxLength - suffix.length) + suffix;
	}
	return str;
};

export const stripStart = (source: string, stripped: string): string => {
	if (!source.startsWith(stripped)) return source;
	return source.slice(stripped.length);
};

export const stripEnd = (source: string, stripped: string): string => {
	if (!source.endsWith(stripped)) return source;
	return source.slice(0, -stripped.length);
};

export const ensureStart = (source: string, ensured: string): string => {
	if (source.startsWith(ensured)) return source;
	return ensured + source;
};

export const ensureEnd = (source: string, ensured: string): string => {
	if (source.endsWith(ensured)) return source;
	return source + ensured;
};
