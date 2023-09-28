import type {Flavored} from '@grogarden/util';
import {z} from 'zod';

// TODO upstream to @grogarden/util?

export const Seconds = z.number();
export type Seconds = Flavored<z.infer<typeof Seconds>, 'Seconds'>;
