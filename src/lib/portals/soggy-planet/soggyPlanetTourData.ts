import {
	backInOut,
	backOut,
	backIn,
	sineOut,
	sineIn,
	quadInOut,
	cubicIn,
	cubicOut,
	quartIn,
	quintIn,
	quintInOut,
} from 'svelte/easing';

import type {TourData} from '$lib/app/tour';
import {createTourBuilder} from '$lib/app/tourBuilder';

// This was tedious to author and the output could be better, but it's good enough.
// There's some jankiness between some tweens that could be polished, but shrug.
// If I do something similar in the future,
// I'll probably make a visual authoring tool,
// maybe with bezier curves or camera physics.

export const createSoggyPlanetTourData = (
	introDuration: number,
	titleDuration: number,
	devMode = false,
): TourData => {
	const b = createTourBuilder();

	const tBase = 1000;
	const tIdle = tBase * 2;
	const tMove = tBase * 3;
	const tEndSequence = 15250;

	const xStart = 3201;
	const yStart = 1405;
	const zoomStart = 5000;

	// (note: these absolute timings are off, but relatively they're the same)
	// The song starts at 12593 (in devMode, +4000 otherwise)
	// and the song final note plays at 4:45 (285000),
	// so the tour should zoom in at roughly 297600. (+4000 for devMode, 301600)
	// The 'debugFinalZoomIn' event fires there to check.
	// The overflow amount can be applied to `tEndSequence`
	// to align everything at the end.

	// -> start in Indian Ocean
	const waitForLoadEvent = b.event('load'); // TODO what happens if the tour is canceled while loading?
	if (devMode) {
		// devMode startup events
		b.pan(xStart, yStart, 0);
		b.zoom(zoomStart, 0);
	} else {
		// non-devMode startup events
		b.pan(xStart, yStart, 2000);
		b.zoom(5, 2000);
		b.wait();
		b.zoom(50, 1000);
		b.wait();
	}
	waitForLoadEvent();
	if (!devMode) {
		// more non-devMode startup events, needed to sync music to timestamps (hacky yes)
		b.zoom(zoomStart, 1000);
		b.wait();
	}
	b.event('showIntro'); // lasts `introDuration`
	b.wait(introDuration);
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

	// -> east Africa
	b.pan(2520, 1047, tMove, backInOut);
	b.zoom(4.3, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(2, 2, tIdle, sineOut);
	b.wait();

	// -> south east Africa
	b.pan(2533, 1247, tMove);
	b.zoom(5.1, tMove, backInOut);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait();

	// -> south Africa
	b.pan(2348, 1215, tMove);
	b.zoom(2.3, tMove);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(-3, 0, tIdle, sineOut);
	b.wait();

	// -> east west Africa
	b.pan(2110, 995, tMove * 3 - tIdle); // provides a music syncing fudge factor
	b.zoom(6.4, tMove * 2 - tIdle); // provides a music syncing fudge factor
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(-1, -1, tIdle, sineOut);
	b.wait();

	// -> west Africa
	b.pan(1894, 875, tMove);
	b.zoom(4.1, tMove);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(-4, -1, tIdle, sineOut);
	b.wait();

	// -> north central Africa zoomed out
	b.pan(2203, 789, tMove);
	b.zoom(2.7, tMove, cubicIn);
	b.wait();
	b.zoomBy(0.95, tIdle, cubicOut);
	b.panBy(-10, -5, tIdle, cubicOut);
	b.wait();

	// -> north east Africa
	b.pan(2287, 689, tMove, backInOut);
	b.zoom(6.5, tMove);
	b.wait(tMove);
	b.zoom(5.6, tMove);
	b.wait(tIdle);

	// -> north west Africa & Spain
	b.pan(2034, 600, tMove * 2);
	b.wait(tMove);
	b.zoom(6.2, tMove);
	b.wait();
	b.zoomBy(1.01, tIdle, sineOut);
	b.panBy(-2, -1, tIdle, sineOut);
	b.wait();

	// -> France
	b.pan(2042, 491, tMove);
	b.zoom(10.9, tMove);
	b.wait();
	b.zoomBy(0.9, tIdle, backInOut);
	b.panBy(0, 3, tIdle, sineOut);
	b.wait();

	// -> UK
	b.pan(1981, 405, tMove);
	b.zoom(9, tMove);
	b.wait();
	b.panBy(-2, -2, tIdle, sineOut);
	b.zoomBy(0.98, tIdle, sineOut);
	b.wait();

	// -> Iceland
	b.pan(1843, 290, tMove);
	b.zoom(11, tMove, backIn);
	b.wait();
	b.zoomBy(1.04, tIdle, backOut);
	b.wait();

	// -> central Europe zoomed out
	b.pan(2090, 443, tMove * 2);
	b.zoom(3, tMove * 2);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(2, 1, tIdle, sineOut);
	b.wait();

	// -> north Europe
	b.pan(2155, 408, tMove, backInOut);
	b.zoom(7.5, tMove, sineIn);
	b.wait();
	b.zoomBy(1.17, tIdle, sineOut);
	b.panBy(2, -3, tIdle, sineOut);
	b.wait();

	// -> northwest Mediterranean
	b.pan(2176, 510, tMove, quadInOut);
	b.zoom(10.5, tMove + tIdle, cubicIn);
	b.wait(tMove);
	b.panBy(1, 4, tIdle, sineOut);
	b.wait();

	// -> Mediterranean zoomed out
	b.pan(2223, 574, tMove);
	b.zoom(3.8, tMove, cubicOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(3, 5, tIdle, sineOut);
	b.wait();

	// -> Scandanavia
	b.pan(2322, 337, tMove);
	b.zoom(4.3, tMove, quadInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, -4, tIdle, sineOut);
	b.wait();

	// -> north east Europe zoomed out
	b.pan(2657, 323, tMove);
	b.zoom(1.7, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.wait();

	// -> Black Sea and Caspian Sea
	b.pan(2546, 497, tMove);
	b.zoom(4.2, tMove);
	b.wait();
	b.zoomBy(1.03, tIdle, sineOut);
	b.panBy(-1, 3, tIdle, sineOut);
	b.wait();

	// -> Middle East
	b.pan(2577, 741, tMove * 2);
	b.zoom(2.9, tMove * 2, backInOut);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait();

	// -> west south Asia
	b.pan(2821, 824, tMove);
	b.zoom(3.7, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(2, 1, tIdle, sineOut);
	b.wait();

	// -> east south Asia
	b.pan(3097, 770, tMove);
	b.zoom(6.7, tMove);
	b.wait();
	b.panBy(6, -1, tIdle, sineOut);
	b.zoomBy(1.02, tIdle, sineOut);
	b.wait();

	// -> south east Asia
	b.pan(3216, 835, tMove);
	b.zoom(4.3, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(2, 2, tIdle, sineOut);
	b.wait();

	// -> south east Asia and Melanesia
	b.pan(3511, 984, tMove);
	b.zoom(2.45, tMove);
	b.wait();
	b.zoomBy(0.96, tIdle, sineOut);
	b.panBy(2, 1, tIdle, sineOut);
	b.wait();
	b.zoomBy(1.16, tMove, quadInOut);
	b.panBy(2, 6, tMove, sineOut);
	b.wait();

	// -> Australia
	b.pan(3589, 1332, tMove);
	b.zoom(2.8, tMove, quadInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, 3, tIdle, sineOut);
	b.wait();

	// -> New Zealand
	b.pan(4014, 1489, tMove);
	b.zoom(7, tMove, cubicIn);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(3, 0, tIdle, sineOut);
	b.wait();

	// -> Polynesia zoomed out (not all of it unfortunately - resolution is too coarse for a good experience)
	b.pan(4059, 1229, tMove);
	b.zoom(1.4, tMove * 2);
	b.wait(tMove + tIdle / 2);

	// south east Asia and Australia zoomed out
	b.pan(3772, 1199, tMove - tIdle / 2, quadInOut);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(-16, -16, tIdle, sineOut);
	b.wait();

	// -> east Asia
	b.pan(3335, 675, tMove);
	b.zoom(3.5, tMove);
	b.wait();
	b.zoomBy(1.04, tIdle, sineOut);
	b.panBy(-2, -6, tIdle, sineOut);
	b.wait();

	// -> north east east Asia
	b.pan(3595, 588, tMove);
	b.zoom(5.6, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(1, 0, tIdle, sineOut);
	b.wait();

	// -> east Asia zoomed out
	b.pan(3465, 612, tMove * 2, backInOut);
	b.zoom(1, tMove * 2);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(-2, 1, tIdle, sineOut);
	b.wait();

	// -> Hawaii
	b.pan(4359, 788, tMove, quintInOut);
	b.zoom(13, tMove, quintIn);
	b.wait();
	b.zoomBy(1.22, tIdle, sineOut);
	b.panBy(2, 0, tIdle, sineOut);
	b.wait();

	// -> Bering Strait
	b.pan(4136, 306, tMove, cubicIn);
	b.zoom(3, tMove, cubicOut);
	b.wait(tMove);
	b.panBy(10, 15, tIdle);
	b.zoom(2.8, tIdle / 2);
	b.wait(tIdle / 2);
	b.zoom(2.9, tIdle / 2);
	b.wait(tIdle / 2);

	// -> north Canada
	b.pan(5043, 281, tMove + tIdle, quadInOut); // move a tad slower, this is a rough one, pls don't get seasick
	b.zoom(2.4, tIdle);
	b.wait(tIdle);
	b.zoom(2, tMove, backInOut);
	b.wait();
	b.zoomBy(1.03, tIdle, sineOut);
	b.panBy(4, 0, tIdle, sineOut);
	b.wait();

	// -> north west North America zoomed in
	b.pan(4743, 478, tMove);
	b.zoom(9.1, tMove, quartIn);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(-2, 3, tIdle, sineOut);
	b.wait();

	// -> west North America zoomed in
	b.pan(4775, 578, tMove);
	b.zoom(10.1, tMove);
	b.wait();
	b.zoomBy(1.03, tIdle, sineOut);
	b.panBy(0, 3, tIdle, sineOut);
	b.wait();

	// -> west North America zoomed out
	b.pan(4695, 602, tMove);
	b.zoom(3, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, 1, tIdle, sineOut);
	b.wait();

	// -> Gulf of Mexico
	b.pan(4999, 732, tMove);
	b.zoom(4.6, tMove, backInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(3, 1, tIdle, sineOut);
	b.wait();

	// -> south east North America
	b.pan(5160, 673, tMove);
	b.zoom(6.8, tMove);
	b.wait();
	b.zoomBy(1.04, tIdle, sineOut);
	b.panBy(3, 0, tIdle, sineOut);
	b.wait();

	// -> north east North America
	b.pan(5297, 549, tMove);
	b.zoom(4.7, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(2, -3, tIdle, sineOut);
	b.wait();

	// -> Carribbean
	b.pan(5290, 776, tMove);
	b.zoom(5.6, tMove, backInOut);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait();

	// -> Central America
	b.pan(5176, 872, tMove);
	b.zoom(4.7, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait();

	// -> northern South America
	b.pan(5395, 908, tMove);
	b.zoom(5.6, tMove);
	b.wait();
	b.zoomBy(1.01, tIdle, sineOut);
	b.panBy(2, 0, tIdle, sineOut);
	b.wait();

	// -> central South America
	b.pan(5510, 1052, tMove);
	b.zoom(5.1, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, 2, tIdle, sineOut);
	b.wait();

	// -> north South America and Central America zoomed out
	b.pan(5414, 1011, tMove);
	b.zoom(2, tMove);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.wait();

	// -> south Source America
	b.pan(5538, 1416, tMove);
	b.zoom(2.2, tMove, backInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, 4, tIdle, sineOut);
	b.wait();

	// -> equator zoomed out
	b.pan(5163, 1016, tMove * 2 - tIdle / 2, backInOut);
	b.zoom(0.6, tMove * 2 - tIdle / 2);
	b.wait();
	b.zoomBy(0.985, tIdle / 2, sineOut);
	b.panBy(7, -6, tIdle / 2, sineOut);
	b.wait();

	// -> disappear zooming into the Mariana Trench
	// TODO validate that there's enough time to finish the end sequence
	b.pan(7764, 895, tEndSequence, quadInOut);
	b.zoom(0.66, tMove);
	b.wait(tMove);
	b.zoom(0.56, tMove);
	b.wait(tMove);
	b.zoom(0.7, tMove);
	b.wait(tMove);
	b.zoom(0.6, tEndSequence - tMove * 3 - 2000); // a bit hacky but whatev
	b.wait(tEndSequence - tMove * 3 - 2000); // a bit hacky but whatev
	b.zoom(5, tMove, quadInOut);
	b.wait(tMove);
	b.zoomBy(0.85, 500);
	b.wait(500);
	b.event('debugFinalZoomIn');
	b.zoom(400, 1000);
	b.wait();
	b.wait(1000);
	b.event('showTitle');
	b.wait(titleDuration);
	b.event('showCredits');
	b.event('playOceanWavesSound');
	b.wait(1000000000); // let the user manually end it, or wait a million seconds
	b.zoomBy(1, 0); // TODO this is a hack, needed because `wait` steps don't prolong the end

	return b.finalize();
};
