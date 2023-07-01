import {sineOut, quadInOut} from 'svelte/easing';

import type {TourData} from '$lib/app/tour';
import {createTourBuilder} from '$lib/app/tourBuilder';
import {z} from 'zod';

// TODO BLOCK fade to night at end

export const Point_Of_Interest = z.object({
	name: z.string(),
	url: z.string(),
	myth: z.boolean().optional(),
	x: z.number(),
	y: z.number(),
});
export type Point_Of_Interest = z.infer<typeof Point_Of_Interest>;

export const points_of_interest: Point_Of_Interest[] = [
	// 2.2 67 -1358
	{name: 'Zealandia', url: 'https://wikipedia.org/wiki/Zealandia', x: 400, y: 70},
	// 2.6 664 -920
	{name: 'Sundaland', url: 'https://wikipedia.org/wiki/Sundaland', x: 300, y: -200},
	// 3.9 1222 -940
	{
		name: 'Kumari Kandam',
		url: 'https://wikipedia.org/wiki/Kumari_Kandam',
		myth: true,
		x: 0,
		y: 404,
	},
	// 3.2 1445 -1223
	{name: 'Lemuria', url: 'https://wikipedia.org/wiki/Lemuria', myth: true, x: 200, y: 230},
	// 3.5 1221 -1634
	{name: 'Persian Gulf', url: 'https://wikipedia.org/wiki/Persian_Gulf', x: 210, y: -80},
	// 10 1648 -527
	{
		name: 'Black Sea deluge',
		url: 'https://wikipedia.org/wiki/Black_Sea_deluge_hypothesis',
		myth: true,
		x: 0,
		y: 50,
	},
	// 6.8 1061 -444
	{name: 'Adriatic Sea', url: 'https://wikipedia.org/wiki/Adriatic_Sea', x: 130, y: -410},
	// 13.3 2022 -403
	{name: 'Doggerland', url: 'https://wikipedia.org/wiki/Doggerland', x: 0, y: -200},
	// 16.1 2105 -490
	{name: 'Ys', url: 'https://wikipedia.org/wiki/Ys', myth: true, x: 20, y: 20},
	// 5.7 2136 -323
	{name: 'Thule', url: 'https://wikipedia.org/wiki/Thule', myth: true, x: -290, y: -430},
	// 3.2 4036 -302
	{name: 'Beringia', url: 'https://wikipedia.org/wiki/Beringia', x: -200, y: 230},
	// 11 3404 -482
	{name: 'Missoula floods', url: 'https://wikipedia.org/wiki/Missoula_floods', x: 110, y: -130},
	// 3.5 4591 -577
	{
		name: 'Land bridges of Japan',
		url: 'https://wikipedia.org/wiki/Land_bridges_of_Japan',
		x: 400,
		y: 300,
	},
	// 2 4162 -978
	{
		name: 'Mu',
		url: 'https://wikipedia.org/wiki/Mu_(mythical_lost_continent)',
		myth: true,
		x: 320,
		y: -30,
	},
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
	return `<span style="position: relative; left: ${data.x}px; top: ${data.y}px;">${
		data.myth ? link + `<span title="${name} may be a myth">?</span>` : link
	}</span>`;
};

export const create_soggy_planet_tour_data = (
	title_duration: number,
	dev_mode = false,
): TourData => {
	const b = createTourBuilder();

	const t_base = 1000;
	const t_idle = t_base * 6;
	const t_move = t_base * 3; // expected to be lower than idle for some calculations
	const t_end_sequence = 15250;
	const t_intro_text = 2000;
	const t_intro_idle = 4000;

	const x_start = 24;
	const y_start = 1405;
	const zoom_start = 5000;

	// TODO refactor, maybe to be stateful to simplify the API
	const smooth_sea_level_to = (from: number, to: number, duration = 70): number => {
		let total = 0;
		if (from === to) return 0;
		if (from > to) {
			for (let i = from; i >= to; i--) {
				b.event('update_sea_level', {min: i, max: i});
				b.wait(duration);
				total += duration;
			}
		} else {
			for (let i = from; i <= to; i++) {
				b.event('update_sea_level', {min: i, max: i});
				b.wait(duration);
				total += duration;
			}
		}
		return total;
	};

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
	b.event('update_land_images', {min: 0, max: 11});
	b.event('update_daylight', {min: 0, max: 0});
	b.event('update_sea_level', {min: 12, max: 12}); // 12 is present day sea level
	b.event('play_water_trickle');
	b.event('show_text', {content: 'for tens of thousands of years', count: 3});
	b.zoom(200, 2000);
	b.wait(t_intro_text);
	b.event('show_text', {content: 'civilizations have thrived', count: 3});
	b.zoom(50, 3000);
	b.wait(t_intro_text);
	b.event('show_text', {content: 'along coastlines and waterways', count: 3});
	b.wait(t_intro_text);
	b.wait(t_intro_idle - 1000);
	b.event('clear_text');
	b.wait(1000);
	b.event('show_text', {
		content: `<span style="position: relative; left: 0; top: -170px;">around 19 or 20 thousand years ago</span>`,
		count: 3,
	});
	b.zoom(3, 6000);
	b.wait(t_intro_text);
	b.event('show_text', {
		content: `<span style="position: relative; left: 0; top: -195px;">at the end of <a href="https://wikipedia.org/wiki/Last_Glacial_Maximum">the Last Glacial Maximum</a></span>`,
		count: 3,
	});
	b.wait(t_intro_text);
	b.event('show_text', {
		content: `<span style="position: relative; left: 0; top: -170px;">global sea levels were about 125 meters lower</span>`,
		count: 3,
	});
	b.wait(t_intro_text - smooth_sea_level_to(12, 0));
	b.wait(t_intro_idle);
	b.event('clear_text');
	b.wait(1000);
	b.event('update_land_images', {min: 6, max: 6});
	b.event('play_main_song');
	b.event('show_text', {
		content: `<span style="position: relative; left: 170px; top: -80px;">glaciers ate mountains of moisture</span>`,
		count: 2,
	});
	b.pan(-174, 1092, 4000);
	b.zoom(0.7, 4000);
	b.wait(t_intro_text + t_intro_text / 2);
	b.event('show_text', {
		content: `<span style="position: relative; left: 200px; top: -90px;">and myth flooded our imaginations</span>`,
		count: 2,
	});
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
	b.pan(-67, 1358, t_move);
	b.zoom(2.2, t_move);
	b.wait(t_move - smooth_sea_level_to(1, 12));
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 2, t_idle, sineOut);
	b.wait(1000); // delay for music
	b.event('show_text', render_content('Zealandia'));
	b.wait(800 - smooth_sea_level_to(11, 0));
	b.event('update_land_images', {min: 0, max: 11});
	b.wait();

	// Sundaland
	b.event('clear_text');
	b.pan(-664, 920, t_move);
	b.zoom(1.8, t_move / 2);
	b.wait(t_move / 2 - smooth_sea_level_to(1, 12));
	b.zoom(2.6, t_move / 2);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(1, 2, t_idle, sineOut);
	b.wait(1000); // delay for music
	b.event('show_text', render_content('Sundaland'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(11, 0));

	// Kumari Kandam
	b.event('clear_text');
	b.pan(-1222, 940, t_move);
	b.zoom(1.8, t_move / 2);
	b.wait(t_move / 2 - smooth_sea_level_to(1, 12));
	b.zoom(3.9, t_move / 2);
	b.wait(1000);
	b.event('show_text', render_content('Kumari Kandam'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(11, 0));
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 0, t_idle, sineOut);
	b.wait();

	// Lemuria
	b.event('clear_text');
	b.pan(-1445, 1223, t_move);
	b.zoom(2.9, t_move / 2);
	b.wait(t_move / 2 - smooth_sea_level_to(1, 12));
	b.zoom(3.2, t_move / 2);
	b.wait();
	b.zoomBy(0.98, t_idle, sineOut);
	b.panBy(1, -2, t_idle, sineOut);
	b.event('show_text', render_content('Lemuria'));
	b.wait(1000 - smooth_sea_level_to(11, 0));
	b.wait(1000);
	b.wait(1500 - smooth_sea_level_to(1, 12));
	b.wait(1500 - smooth_sea_level_to(11, 0)); // - 2000
	b.wait();

	// Persian Gulf
	b.event('clear_text');
	b.pan(-1460, 724, t_move);
	b.zoom(4.7, t_move / 2);
	b.wait(t_move / 2 - smooth_sea_level_to(1, 12));
	b.event('update_land_images', {min: 6, max: 6});
	b.zoom(3.5, t_move / 2);
	b.wait();
	b.zoomBy(1.01, t_idle, sineOut);
	b.panBy(-1, -2, t_idle, sineOut);
	b.event('show_text', render_content('Persian Gulf'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(11, 0));

	// Black Sea deluge
	b.event('clear_text');
	b.pan(-1648, 527, t_move);
	b.zoom(4.6, t_move * (1 / 3));
	b.wait(t_move * (1 / 3) - smooth_sea_level_to(1, 12));
	b.zoom(3.4, t_move * (1 / 3));
	b.wait(t_move * (1 / 3));
	b.zoom(10, t_move * (1 / 3));
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, -1, t_idle, sineOut);
	b.event('show_text', render_content('Black Sea deluge'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(11, 0));

	// Adriatic Sea
	b.event('clear_text');
	b.pan(-1847, 578, t_move);
	b.zoom(6.8, t_move);
	b.wait(t_move - smooth_sea_level_to(1, 12));
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(-1, -3, t_idle, sineOut);
	b.event('show_text', render_content('Adriatic Sea'));
	b.wait(t_idle - smooth_sea_level_to(11, 0));

	// Doggerland
	b.event('clear_text');
	b.pan(-2022, 403, t_move);
	b.zoom(5.6, t_move * (1 / 2));
	b.wait(t_move * (1 / 2));
	b.zoom(4.3, t_move * (1 / 2));
	b.wait();
	b.panBy(2, 2, t_idle, sineOut);
	b.wait(2000); // delay for music
	b.zoom(13.3, t_move * (1 / 2));
	b.wait(600); // delay for music
	b.event('show_text', render_content('Doggerland'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(1, 11));

	// Ys
	b.event('clear_text');
	b.pan(-2105, 490, t_move);
	b.zoom(9.6, t_move / 2);
	b.wait(t_move / 2 - smooth_sea_level_to(10, 0));
	b.zoom(16.1, t_move / 2);
	b.wait();
	b.zoomBy(0.65, t_idle);
	b.panBy(1, 1, t_idle, sineOut);
	b.event('show_text', render_content('Ys'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(1, 9, 80));

	// pan through North America
	b.event('clear_text');
	b.pan(-3020, 548, t_idle + t_move);
	b.zoom(1.6, t_idle + t_move - 2500);
	b.wait(t_idle + t_move - smooth_sea_level_to(8, 0));

	// Beringia
	b.event('clear_text');
	b.pan(-4036, 302, t_move);
	b.zoom(2.4, t_move * (1 / 2));
	b.wait(t_move * (1 / 2) - smooth_sea_level_to(1, 12));
	b.zoom(3.4, t_move * (1 / 2));
	b.wait();
	b.zoomBy(0.98, t_idle, sineOut);
	b.panBy(3, 2, t_idle, sineOut);
	b.event('show_text', render_content('Beringia'));
	b.wait(2000 - smooth_sea_level_to(11, 0)); // delay for music
	b.wait();

	// Missoula floods
	b.event('clear_text');
	b.pan(-3404, 482, t_move);
	b.zoom(2.6, t_move / 2);
	b.wait(t_move / 2);
	b.zoom(11, t_move / 2);
	b.wait();
	b.zoomBy(0.77, t_idle);
	b.panBy(10, -2, t_idle);
	b.event('show_text', render_content('Missoula floods'));
	b.wait();

	// pan through South America
	b.event('clear_text');
	b.pan(-2764, 1267, t_move * 2);
	b.zoom(1.3, t_move);
	b.wait();

	// Land bridges of Japan
	b.event('clear_text');
	b.pan(-4591, 577, t_move);
	b.zoom(1.9, t_move * (1 / 2));
	b.wait(t_move * (1 / 2) - smooth_sea_level_to(1, 12));
	b.zoom(3.5, t_move * (1 / 2));
	b.wait();
	b.zoomBy(1.01, t_idle, sineOut);
	b.panBy(2, -2, t_idle, sineOut);
	b.event('show_text', render_content('Land bridges of Japan'));
	b.wait(b.get_time_diff() - smooth_sea_level_to(11, 0));

	// Mu
	b.event('clear_text');
	b.pan(-4162, 978, t_move);
	b.zoom(1.7, t_move / 2);
	b.wait(t_move / 2 - smooth_sea_level_to(1, 12));
	b.zoom(2, t_move / 2);
	b.wait();
	b.zoomBy(0.99, t_idle, sineOut);
	b.panBy(-2, -2, t_idle, sineOut);
	b.wait(1000 - smooth_sea_level_to(11, 0)); // delay for music
	b.wait(1000 - smooth_sea_level_to(1, 12));
	b.wait(1000 - smooth_sea_level_to(11, 0));
	b.event('show_text', render_content('Mu'));
	b.wait();
	b.event('clear_text');

	// -> disappear zooming into the Mariana Trench
	// TODO validate that there's enough time to finish the end sequence
	b.pan(-434, 635, t_end_sequence, quadInOut);
	b.zoom(1.1, t_move);
	b.wait(t_move);
	b.zoom(0.8, t_move);
	b.wait(t_move);
	b.zoom(1.1, t_move);
	b.wait(t_move);
	b.zoom(1.0, t_end_sequence - t_move * 3 - 2000); // a bit hacky but whatev
	b.wait(t_end_sequence - t_move * 3 - 2000); // a bit hacky but whatev
	b.zoom(5, t_move, quadInOut);
	b.wait(t_move);
	b.zoomBy(0.85, 500);
	b.wait(500);
	b.event('debug_final_zoom_in');
	b.zoom(4000, 1000);
	b.wait();
	b.wait(1000);
	b.event('show_title');
	b.wait(title_duration);
	b.event('show_credits');
	b.wait(1000000000); // let the user manually end it, or wait a million seconds
	b.zoomBy(1, 0); // TODO this is a hack, needed because `wait` steps don't prolong the end

	return b.finalize();
};
