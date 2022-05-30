import {writable, type Writable} from 'svelte/store';
import type {DialogData} from '@feltcoop/felt/ui/dialog/dialog';

// TODO probably do a different pattern than global stores, put on a context object most likely
export const dialogs: Writable<DialogData[]> = writable([]);
