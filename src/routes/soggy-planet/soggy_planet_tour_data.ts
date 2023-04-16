import {backInOut, sineOut, quadInOut} from 'svelte/easing';

import type {TourData} from '$lib/app/tour';
import {createTourBuilder} from '$lib/app/tourBuilder';

// This was tedious to author and the output could be better, but it's good enough.
// There's some jankiness between some tweens that could be polished, but shrug.
// If I do something similar in the future,
// I'll probably make a visual authoring tool,
// maybe with bezier curves or camera physics.

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

	const x_start = 3201;
	const y_start = 1405;
	const zoom_start = 5000;

	// TODO BLOCK start where?
	const wait_for_load_event = b.event('load'); // TODO what happens if the tour is canceled while loading?
	if (dev_mode) {
		// devMode startup events
		b.pan(x_start, y_start, 0);
		b.zoom(zoom_start, 0);
	} else {
		// non-devMode startup events
		b.pan(x_start, y_start, 2000);
		b.zoom(5, 2000);
		b.wait();
		b.zoom(50, 1000);
		b.wait();
	}
	wait_for_load_event();
	if (!dev_mode) {
		// more non-devMode startup events, needed to sync music to timestamps (hacky yes)
		b.zoom(zoom_start, 1000);
		b.wait();
	}
	b.event('showIntro'); // lasts `introDuration`
	b.wait(intro_duration);
	b.zoom(50, 2450); // first wave
	b.pan(x_start + 1, y_start - 1, 2450);
	b.wait();
	b.zoom(12, 6650); // slow zoom out
	b.pan(x_start + 3, y_start - 7, 6650);
	b.event('showTitle'); // lasts `titleDuration`
	b.wait();
	b.zoom(13, 1000); // gently pulse back
	b.pan(x_start + 4, y_start - 6, 1000);
	b.wait();
	b.zoom(4, 500); // second wave
	b.wait(500);
	b.pan(x_start, y_start, 3900, backInOut);
	b.zoom(6, 8400, backInOut);
	b.wait(2000);
	b.event('playMainSong'); // TODO this is a synchronous event- should it have a different API?
	b.wait(1900);

	// -> slowly pan to the east African coast while zooming out
	b.pan(2560, 1090, 13000);
	b.wait(4500);
	b.zoom(2, 9000);
	b.wait();
	b.zoomBy(0.97, 3000, sineOut);
	b.wait(3000);

	// At this point, we no longer try to sync the music
	// to camera movements until the very end.
	// The time variables like `tMove` and `tIdle` are tweaked
	// to sync the ending of the music with the final camera movements.
	// (so they shouldn't be used before this point!)

	// TODO BLOCK start at the first point of interest
	b.pan(2520, 1047, t_move, backInOut);
	b.zoom(4.3, t_move);
	b.wait();
	b.zoomBy(1.02, t_idle, sineOut);
	b.panBy(2, 2, t_idle, sineOut);
	b.wait();

	// -> disappear zooming into the Mariana Trench
	// TODO validate that there's enough time to finish the end sequence
	b.pan(7764, 895, t_end_sequence, quadInOut);
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
	b.event('debugFinalZoomIn');
	b.zoom(400, 1000);
	b.wait();
	b.wait(1000);
	b.event('showTitle');
	b.wait(title_duration);
	b.event('showCredits');
	b.wait(1000000000); // let the user manually end it, or wait a million seconds
	b.zoomBy(1, 0); // TODO this is a hack, needed because `wait` steps don't prolong the end

	return b.finalize();
};
