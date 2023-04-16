import {sineOut, quadInOut} from 'svelte/easing';

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
	// 2.2 67 -1358
	{name: 'Zealandia', url: 'https://en.wikipedia.org/wiki/Zealandia'},
	// 2.6 664 -920
	{name: 'Sundaland', url: 'https://wikipedia.org/wiki/Sundaland'},
	// 3.9 1222 -940
	{name: 'Kumari Kandam', url: 'https://wikipedia.org/wiki/Kumari_Kandam', myth: true},
	// 3.2 1445 -1223
	{name: 'Lemuria', url: 'https://wikipedia.org/wiki/Lemuria', myth: true},
	// 3.5 1221 -1634
	{name: 'Kerguelen Plateau', url: 'https://wikipedia.org/wiki/Kerguelen_Plateau'},
	// 6.2 1061 -444
	{name: 'Altai flood', url: 'https://wikipedia.org/wiki/Altai_flood'},
	// 10 1648 -527
	// TODO BLOCK show the water go in/out here
	{
		name: 'Black Sea deluge',
		url: 'https://wikipedia.org/wiki/Black_Sea_deluge_hypothesis',
		myth: true,
	},
	// 13.3 2022 -403
	{name: 'Doggerland', url: 'https://wikipedia.org/wiki/Doggerland'},
	// 16.1 2105 -490
	{name: 'Ys', url: 'https://wikipedia.org/wiki/Ys', myth: true},
	// 5.7 2136 -323
	{name: 'Thule', url: 'https://wikipedia.org/wiki/Thule', myth: true},
	// 11 3404 -482
	{name: 'Missoula floods', url: 'https://wikipedia.org/wiki/Missoula_floods'},
	// 3.2 4036 -302
	{name: 'Beringia', url: 'https://wikipedia.org/wiki/Beringia'},
	// 3.5 4591 -577
	{name: 'Land bridges of Japan', url: 'https://wikipedia.org/wiki/Land_bridges_of_Japan'},
	// 2 4162 -978
	{name: 'Mu', url: 'https://wikipedia.org/wiki/Mu_(mythical_lost_continent)', myth: true},
];

const lookup_point_of_interest = (name: string): Point_Of_Interest => {
	// TODO make a map?
	const found = points_of_interest.find((p) => p.name === name);
	if (!found) throw Error(`unknown point of interest "${name}"`);
	return found;
};

const render_content = (name: string): string => {
	const data = lookup_point_of_interest(name);
	const link = `<a href="${data.url}">${name}</a>`;
	return data.myth ? link + '?' : link;
};

export const create_soggy_planet_tour_data = (
	title_duration: number,
	dev_mode = false,
): TourData => {
	const b = createTourBuilder();

	const t_base = 1000;
	const t_idle = t_base * 6;
	const t_move = t_base * 3;
	const t_end_sequence = 15250;
	const t_intro_text = 2000;
	const t_intro_idle = 4000;

	const x_start = -24;
	const y_start = -1405;
	const zoom_start = 5000;

	// TODO BLOCK start at night, then go to daylight when music starts

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
	// we're now loaded and ready to go

	b.event('play_water_trickle');
	b.event('show_text', `for tens of thousands of years`);
	b.zoom(200, 2000);
	b.wait(t_intro_text);
	b.event('show_text', `humanity has thrived`);
	b.zoom(50, 3000);
	b.wait(t_intro_text);
	b.event('show_text', `along coastlines and waterways`);
	b.wait(t_intro_text);
	b.wait(t_intro_idle - 1000);
	b.event('clear_text');
	b.wait(1000);
	b.event('show_text', `around 19 or 20 thousand years ago`);
	b.zoom(10, 2000);
	b.wait(t_intro_text);
	b.event('show_text', `at the end of the Last Glacial Maximum`);
	b.zoom(3, 4000);
	b.wait(t_intro_text);
	b.event('show_text', `global sea levels were about 125 meters lower`);
	b.wait(t_intro_text);
	b.wait(t_intro_idle - 1000);
	b.event('clear_text');
	b.wait(1000);
	b.event('play_main_song');
	b.event('show_text', `many habitats were curiously drier`);
	b.pan(174, -1092, 4000);
	b.zoom(0.7, 4000);
	b.wait(t_intro_text + t_intro_text / 2);
	b.event('show_text', `and myth flooded our imaginations`);
	b.wait(t_intro_text / 2);
	b.wait(t_intro_idle);
	b.event('clear_text');
	b.wait();

	// At this point, we no longer try to sync the music
	// to camera movements until the very end.
	// The time variables like `tMove` and `tIdle` are tweaked
	// to sync the ending of the music with the final camera movements.
	// (so they shouldn't be used before this point!)

	// Zealandia
	// 2.2 67 -1358
	b.pan(67, -1358, t_move);
	b.zoom(2.2, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 2, t_idle, sineOut);
	b.wait(1000); // delay for music
	b.event('show_text', render_content('Zealandia'));
	b.wait();

	// Sundaland
	b.event('clear_text');
	// 2.6 664 -920
	b.pan(664, -920, t_move);
	b.zoom(2.6, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(1, 2, t_idle, sineOut);
	b.wait(1000); // delay for music
	b.event('show_text', render_content('Sundaland'));
	b.wait();

	// Kumari Kandam
	b.event('clear_text');
	// 3.9 1222 -940
	b.pan(1222, -940, t_move);
	b.zoom(3.9, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 0, t_idle, sineOut);
	b.event('show_text', render_content('Kumari Kandam'));
	b.wait();

	// Lemuria
	b.event('clear_text');
	// 3.2 1445 -1223
	b.pan(1445, -1223, t_move);
	b.zoom(3.2, t_move);
	b.wait();
	b.zoomBy(0.98, t_idle, sineOut);
	b.panBy(1, -2, t_idle, sineOut);
	b.event('show_text', render_content('Lemuria'));
	b.wait();

	// Kerguelen Plateau
	b.event('clear_text');
	// 3.5 1221 -1634
	b.pan(1221, -1634, t_move);
	b.zoom(3.5, t_move);
	b.wait();
	b.zoomBy(1.01, t_idle, sineOut);
	b.panBy(-1, -2, t_idle, sineOut);
	b.event('show_text', render_content('Kerguelen Plateau'));
	b.wait();

	// Altai flood
	b.event('clear_text');
	// 6.2 1061 -444
	b.pan(1061, -444, t_move);
	b.zoom(6.2, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(-1, -3, t_idle, sineOut);
	b.event('show_text', render_content('Altai flood'));
	b.wait();

	// Black Sea deluge
	b.event('clear_text');
	// 10 1648 -527
	b.pan(1648, -527, t_move);
	b.zoom(10, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, -1, t_idle, sineOut);
	b.event('show_text', render_content('Black Sea deluge'));
	b.wait();

	// Doggerland
	b.event('clear_text');
	// 13.3 2022 -403
	// TODO BLOCK show the level go from lowest to highest, then down the tick to show the island, then show the text
	b.pan(2022, -403, t_move);
	b.zoom(13.3, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 2, t_idle, sineOut);
	b.wait(2600); // delay for music
	b.event('show_text', render_content('Doggerland'));
	b.wait();

	// Ys
	b.event('clear_text');
	// 16.1 2105 -490
	// TODO BLOCK show the level pulse around the islands
	b.pan(2105, -490, t_move);
	b.zoom(16.1, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(1, -2, t_idle, sineOut);
	b.event('show_text', render_content('Ys'));
	b.wait();

	// Thule
	b.event('clear_text');
	// 5.7 2136 -323
	b.pan(2136, -323, t_move);
	b.zoom(5.7, t_move);
	b.wait();
	b.zoomBy(0.98, t_idle, sineOut);
	b.panBy(0, 2, t_idle, sineOut);
	b.event('show_text', render_content('Thule'));
	b.wait();

	// Beringia
	b.event('clear_text');
	// 3.2 4036 -302
	b.pan(4036, -302, t_move);
	b.zoom(3.2, t_move);
	b.wait();
	b.zoomBy(0.98, t_idle, sineOut);
	b.panBy(3, 2, t_idle, sineOut);
	b.wait(2000); // delay for music
	b.event('show_text', render_content('Beringia'));
	b.wait();

	// Missoula floods
	b.event('clear_text');
	// 11 3404 -482
	b.pan(3404, -482, t_move);
	b.zoom(11, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(1, -2, t_idle, sineOut);
	b.event('show_text', render_content('Missoula floods'));
	b.wait();

	// Land bridges of Japan
	b.event('clear_text');
	// 3.5 4591 -577
	b.pan(4591, -577, t_move);
	b.zoom(3.5, t_move);
	b.wait();
	b.zoomBy(1.01, t_idle, sineOut);
	b.panBy(2, -2, t_idle, sineOut);
	b.event('show_text', render_content('Land bridges of Japan'));
	b.wait();

	// Mu
	b.event('clear_text');
	// 2 4162 -978
	b.pan(4162, -978, t_move);
	b.zoom(2, t_move);
	b.wait();
	b.zoomBy(0.99, t_idle, sineOut);
	b.panBy(-2, -2, t_idle, sineOut);
	b.wait(3000); // delay for music
	b.event('show_text', render_content('Mu'));
	b.wait();
	b.event('clear_text');

	// -> disappear zooming into the Mariana Trench
	// TODO validate that there's enough time to finish the end sequence
	b.pan(12198, -1204, t_end_sequence, quadInOut);
	b.zoom(0.8, t_move);
	b.wait(t_move);
	b.zoom(0.7, t_move);
	b.wait(t_move);
	b.zoom(0.84, t_move);
	b.wait(t_move);
	b.zoom(0.74, t_end_sequence - t_move * 3 - 2000); // a bit hacky but whatev
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
