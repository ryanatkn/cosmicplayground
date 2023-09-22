import type {Flavored} from '@feltjs/util';
import {round} from '@grogarden/util/maths.js';
import {z} from 'zod';

export type Frequency = number;

export const DEFAULT_VOLUME: Volume = 0.51;

// TODO try to do a different way, `export type Volume = z.infer<typeof Volume>`
export const Volume = z
	.number()
	.min(0)
	.max(1)
	.transform((v) => round(v, 2));
export type Volume = Flavored<z.infer<typeof Volume>, 'Volume'>;

/**
 * Convert a user-facing volume value [0,1] to the actual gain value.
 * We want some sort of nonlinear curve to match user expectations.
 * @param volume
 * @returns
 */
export const volume_to_gain = (volume: Volume): number => volume ** VOLUME_TO_GAIN_EXPONENT;

// TODO why is this exponent so different from the article?
// https://www.dr-lex.be/info-stuff/volumecontrols.html
export const VOLUME_TO_GAIN_EXPONENT = 2.2;

export const SMOOTH_GAIN_TIME_CONSTANT = 0.03;
