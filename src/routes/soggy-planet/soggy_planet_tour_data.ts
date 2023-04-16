import {backInOut, sineOut, quadInOut} from 'svelte/easing';

import type {TourData} from '$lib/app/tour';
import {createTourBuilder} from '$lib/app/tourBuilder';
import {z} from 'zod';

export const Point_Of_Interest = z.object({
	name: z.string(),
	url: z.string(),
	myth: z.boolean().optional(),
});
export type Point_Of_Interest = z.infer<typeof Point_Of_Interest>;

// TODO BLOCK at Altai, maybe alternate between months 7/8 (custom event?)

export const points_of_interest: Point_Of_Interest[] = [
	// 2.2 8259 -1358
	{name: 'Zealandia', url: 'https://en.wikipedia.org/wiki/Zealandia'},
	// 2.6 8856 -920
	{name: 'Sundaland', url: 'https://wikipedia.org/wiki/Sundaland'},
	// 3.9 9414 -940
	{name: 'Kumari Kandam', url: 'https://wikipedia.org/wiki/Kumari_Kandam', myth: true},
	// 3.2 9637 -1223
	{name: 'Lemuria', url: 'https://wikipedia.org/wiki/Lemuria', myth: true},
	// 3.5 9413 -1634
	{name: 'Kerguelen Plateau', url: 'https://wikipedia.org/wiki/Kerguelen_Plateau'},
	// 6.2 9253 -444
	{name: 'Altai flood', url: 'https://wikipedia.org/wiki/Altai_flood'},
	// 10 9840 -527
	// TODO BLOCK show the water go in/out here
	{
		name: 'Black Sea deluge hypothesis',
		url: 'https://wikipedia.org/wiki/Black_Sea_deluge_hypothesis',
		myth: true,
	},
	// 13.3 10214 -403
	{name: 'Doggerland', url: 'https://wikipedia.org/wiki/Doggerland'},
	// 16.1 10297 -490
	{name: 'Ys', url: 'https://wikipedia.org/wiki/Ys', myth: true},
	// 5.7 10328 -323
	{name: 'Thule', url: 'https://wikipedia.org/wiki/Thule', myth: true},
	// 11 11596 -482
	{name: 'Missoula floods', url: 'https://wikipedia.org/wiki/Missoula_floods'},
	// 3.2 12228 -302
	{name: 'Beringia', url: 'https://wikipedia.org/wiki/Beringia'},
	// 3.5 12783 -577
	{name: 'Land bridges of Japan', url: 'https://wikipedia.org/wiki/Land_bridges_of_Japan'},
	// 2 12354 -978
	{name: 'Mu', url: 'https://wikipedia.org/wiki/Mu_(mythical_lost_continent)', myth: true},
];

// TODO BLOCK if time before the deadline, include river valleys (probably just labelled when onscreen  and zoomed in enough, no stopping for them)

export const create_soggy_planet_tour_data = (
	intro_duration: number,
	title_duration: number,
	dev_mode = false,
): TourData => {
	const b = createTourBuilder();

	const t_base = 1000;
	const t_idle = t_base * 2;
	const t_move = t_base * 3;
	const t_end_sequence = 15250;

	const x_start = 12264;
	const y_start = -1405;
	const zoom_start = 5000;

	const wait_for_load_event = b.event('load'); // TODO what happens if the tour is canceled while loading?
	if (dev_mode) {
		// dev_mode startup events
		b.pan(x_start, y_start, 0);
		b.zoom(zoom_start, 0);
	} else {
		// non-dev_mode startup events
		b.pan(x_start, y_start, 2000);
		b.zoom(5, 2000);
		b.wait();
		b.zoom(50, 1000);
		b.wait();
	}
	wait_for_load_event();
	if (!dev_mode) {
		// more non-dev_mode startup events, needed to sync music to timestamps (hacky yes)
		b.zoom(zoom_start, 1000);
		b.wait();
	}
	b.event('show_intro'); // lasts `introDuration`
	b.event('play_water_trickle');
	b.wait(intro_duration);
	b.zoom(50, 2450); // first wave
	b.pan(x_start + 1, y_start - 1, 2450);
	b.wait();
	b.zoom(12, 6650); // slow zoom out
	b.pan(x_start + 3, y_start - 7, 6650);
	b.event('show_title'); // lasts `titleDuration`
	b.wait();
	b.zoom(13, 1000); // gently pulse back
	b.pan(x_start + 4, y_start - 6, 1000);
	b.wait();
	b.zoom(4, 500); // second wave
	b.wait(500);
	b.pan(x_start, y_start, 3900, backInOut);
	b.zoom(6, 8400, backInOut);
	b.wait(2000);
	b.event('play_main_song'); // TODO this is a synchronous event- should it have a different API?
	b.wait();

	// -> zoom out
	b.pan(8259, -1358, 3000);
	b.zoom(2, 3000);
	b.wait();
	b.zoomBy(0.97, 3000, sineOut);
	b.wait(3000);

	// At this point, we no longer try to sync the music
	// to camera movements until the very end.
	// The time variables like `tMove` and `tIdle` are tweaked
	// to sync the ending of the music with the final camera movements.
	// (so they shouldn't be used before this point!)

	// TODO BLOCK fidget

	// Zealandia
	// 2.2 8259 -1358
	b.pan(8259, -1358, t_move);
	b.zoom(2.2, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 2, t_idle, sineOut);
	b.wait();

	// Sundaland
	// 2.6 8856 -920
	b.pan(8856, -920, t_move);
	b.zoom(2.6, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(1, 2, t_idle, sineOut);
	b.wait();

	// Kumari Kandam
	// 3.9 9414 -940
	b.pan(9414, -940, t_move);
	b.zoom(3.9, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 0, t_idle, sineOut);
	b.wait();

	// Lemuria
	// 3.2 9637 -1223
	b.pan(9637, -1223, t_move);
	b.zoom(3.2, t_move);
	b.wait();

	// Kerguelen Plateau
	// 3.5 9413 -1634
	b.pan(9413, -1634, t_move);
	b.zoom(3.5, t_move);
	b.wait();

	// Altai flood
	// 6.2 9253 -444
	b.pan(9253, -444, t_move);
	b.zoom(6.2, t_move);
	b.wait();

	// Black Sea deluge hypothesis
	// 10 9840 -527
	b.pan(9840, -527, t_move);
	b.zoom(10, t_move);
	b.wait();

	// Doggerland
	// 13.3 10214 -403
	b.pan(10214, -403, t_move);
	b.zoom(13.3, t_move);
	b.wait();

	// Ys
	// 16.1 10297 -490
	b.pan(10297, -490, t_move);
	b.zoom(16.1, t_move);
	b.wait();

	// Thule
	// 5.7 10328 -323
	b.pan(10328, -323, t_move);
	b.zoom(5.7, t_move);
	b.wait();

	// Missoula floods
	// 11 11596 -482
	b.pan(11596, -482, t_move);
	b.zoom(11, t_move);
	b.wait();

	// Beringia
	// 3.2 12228 -302
	b.pan(12228, -302, t_move);
	b.zoom(3.2, t_move);
	b.wait();

	// Land bridges of Japan
	// 3.5 12783 -577
	b.pan(12783, -577, t_move);
	b.zoom(3.5, t_move);
	b.wait();

	// Mu
	// 2 12354 -978
	b.pan(12354, -978, t_move);
	b.zoom(2, t_move);
	b.wait();

	// -> disappear zooming into the Mariana Trench
	// TODO validate that there's enough time to finish the end sequence
	b.pan(12198, -1204, t_end_sequence, quadInOut);
	b.zoom(0.66, t_move);
	b.wait(t_move);
	b.zoom(0.56, t_move);
	b.wait(t_move);
	b.zoom(0.7, t_move);
	b.wait(t_move);
	b.zoom(0.6, t_end_sequence - t_move * 3 - 2000); // a bit hacky but whatev
	b.wait(t_end_sequence - t_move * 3 - 2000); // a bit hacky but whatev
	b.zoom(5, t_move, quadInOut);
	b.wait(t_move);
	b.zoomBy(0.85, 500);
	b.wait(500);
	b.event('debug_final_zoom_in');
	b.zoom(400, 1000);
	b.wait();
	b.wait(1000);
	b.event('show_title');
	b.wait(title_duration);
	b.event('show_credits');
	b.wait(1000000000); // let the user manually end it, or wait a million seconds
	b.zoomBy(1, 0); // TODO this is a hack, needed because `wait` steps don't prolong the end

	return b.finalize();
};
