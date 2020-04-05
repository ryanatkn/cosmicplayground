// Gets a random integer between `min` and `max`, both inclusive.
// TODO maybe check if max < min
// TODO maybe reassign `Math.ceil(min)` and `Math.floor(max)`
export const randInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;

// This assumes that `items` has at least one item!
// If an empty array is provided, typechecking fails.
// We could add a `randItemSafe` if some use case
// needs `undefined` in the return type.
// This design was chosen for ergonomics -
// most of the time we are guaranteed to have multiple items in the array,
// and we were using `!` which is just as unsafe and noisy.
export const randItem = <T>(items: T[]): T =>
	items[randInt(0, items.length - 1)];
