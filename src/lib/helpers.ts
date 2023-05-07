import type {Flavored} from '@feltjs/util';
import {round} from '@feltjs/util/maths.js';
import {z} from 'zod';

export const DEFAULT_VOLUME: Volume = 0.51;

// TODO try to do a different way, `export type Volume = z.infer<typeof Volume>`
export const Volume = z
	.number()
	.min(0)
	.max(1)
	.transform<Volume>((v) => round(v, 2));
export type Volume = Flavored<number, 'Volume'>;

export const Seconds = z.number();
export type Seconds = Flavored<number, 'Seconds'>;
