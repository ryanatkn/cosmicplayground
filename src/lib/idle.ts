import {create_context} from '@ryanatkn/fuz/context_helpers.js';
import type {Writable} from 'svelte/store';
import type {ActionReturn} from 'svelte/action';

export const idle_context = create_context<Writable<boolean>>();

interface TrackIdleStateOptions {
	idle: Writable<boolean>;
	time_to_go_idle: number;
	idle_interval_time: number;
}

// TODO try to refactor this, `derived` maybe?

export const track_idle_state = (
	el: Element,
	opts: TrackIdleStateOptions,
): ActionReturn<TrackIdleStateOptions> => {
	const {idle, idle_interval_time} = opts;
	let {time_to_go_idle} = opts;

	let interval: any; // TODO type for browser only? should be `number`
	let idle_timer = 0;

	let $idle: boolean;
	const on_change = (_$idle: boolean) => {
		$idle = _$idle;
	};
	let unsubscribe = idle.subscribe(on_change);

	const update_idle_state = () => {
		if ($idle) return;
		idle_timer += idle_interval_time;
		if (idle_timer >= time_to_go_idle) {
			idle.set(true);
		}
	};

	const start_interval = (idle_interval_time: number) => {
		clearInterval(interval);
		interval = setInterval(update_idle_state, idle_interval_time);
	};
	start_interval(idle_interval_time);

	const reset_idle_state = () => {
		idle_timer = 0;
		if ($idle) idle.set(false);
	};

	el.addEventListener('mousemove', reset_idle_state, {capture: true});
	el.addEventListener('keydown', reset_idle_state, {capture: true});

	return {
		update: ({
			idle,
			idle_interval_time,
			time_to_go_idle: nextTimeToGoIdle,
		}: TrackIdleStateOptions) => {
			time_to_go_idle = nextTimeToGoIdle;
			unsubscribe();
			unsubscribe = idle.subscribe(on_change);
			start_interval(idle_interval_time);
		},
		destroy: () => {
			el.removeEventListener('mousemove', reset_idle_state);
			el.removeEventListener('keydown', reset_idle_state);
			unsubscribe();
			clearInterval(interval);
		},
	};
};
