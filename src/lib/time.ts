import type {Flavored} from '@feltjs/util';
import {z} from 'zod';

// TODO upstream to @feltjs/util?

export const Seconds = z.number();
export type Seconds = Flavored<z.infer<typeof Seconds>, 'Seconds'>;
