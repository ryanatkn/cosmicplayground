type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// these were thrown together quickly - is there a better way to do this?
// there are probably better names for them!
// see `Required`, `Exclude` and `Extract` for possible leads for improvements
type PartialExcept<T, K extends keyof T> = {[P in K]: T[P]} &
	{[P in Exclude<keyof T, K>]?: T[P]};
type PartialOnly<T, K extends keyof T> = {[P in K]?: T[P]} &
	{[P in Exclude<keyof T, K>]: T[P]};

type PartialValues<T> = {
	[P in keyof T]: Partial<T[P]>;
};

// Gets the type of an array's elements,
// e.g. `ArrayElement<typeof [1, 2, 3]> => 1 | 2 | 3`
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
