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
