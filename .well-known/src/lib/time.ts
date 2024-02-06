import type {Flavored} from '@ryanatkn/belt/types.js';
import {z} from 'zod';

// TODO upstream to @ryanatkn/belt?

export const Seconds = z.number();
export type Seconds = Flavored<z.infer<typeof Seconds>, 'Seconds'>;
