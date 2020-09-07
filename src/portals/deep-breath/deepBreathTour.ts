import {
	quartOut,
	quartIn,
	backInOut,
	backOut,
	backIn,
	sineOut,
	sineIn,
	quadInOut,
	quintIn,
	quintOut,
} from 'svelte/easing';

import {TourData} from '../../app/tourStore.js';
import {createTourBuilder} from '../../app/tourBuilder.js';

// This was tedious to author and the output could be better,
// but it's good enough.
// If I do something similar in the future,
// I'll probably make a visual authoring tool,
// maybe with bezier curves or camera physics.

export const createDeepBreathTour = (
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
	b.event('playOceanWavesSound');
	b.zoom(50, 2450); // first wave
	b.pan(xStart + 1, yStart - 1, 2450);
	b.wait();
	b.zoom(12, 6650); // slow zoom out
	b.pan(xStart + 3, yStart - 7, 6650);
	b.event('showTitle'); // lasts `titleDuration`
	b.wait();
	b.zoom(13, 1000); // gently pulse back
	b.pan(xStart + 4, yStart - 6, 1000);
	b.wait();
	b.zoom(4, 500); // second wave
	b.wait(500);
	b.pan(xStart, yStart, 3900, backInOut);
	b.zoom(6, 8400, backInOut);
	b.wait(2000);
	b.event('playSong'); // TODO this is a synchronous event- should it have a different API?
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
	b.wait(tIdle);

	// -> south east Africa
	b.pan(2533, 1247, tMove);
	b.zoom(5.1, tMove, backInOut);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait(tIdle);

	// -> south Africa
	b.pan(2348, 1215, tMove);
	b.zoom(2.3, tMove);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(-3, 0, tIdle, sineOut);
	b.wait(tIdle);

	// -> east west Africa
	b.pan(2110, 995, tMove * 3 - tIdle); // provides a music syncing fudge factor
	b.zoom(6.9, tMove * 2 - tIdle); // provides a music syncing fudge factor
	b.wait();

	// -> west north west Africa
	b.pan(2060, 889, tMove);
	b.zoom(2.9, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(-1, -1, tIdle, sineOut);
	b.wait(tIdle);

	// -> west west Africa
	b.pan(1882, 852, tMove);
	b.zoom(5.4, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(-2, -1, tIdle, sineOut);
	b.wait(tIdle);

	// -> north central Africa
	b.pan(2203, 789, tMove);
	b.zoom(2.7, tMove, quartIn);
	b.wait();
	b.zoomBy(0.95, tIdle, quartOut);
	b.panBy(-10, -5, tIdle, quartOut);
	b.wait(tIdle);

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
	b.wait(tIdle);

	// -> France
	b.pan(2042, 491, tMove);
	b.zoom(10.9, tMove);
	b.wait();
	b.zoomBy(0.9, tIdle, backInOut);
	b.panBy(0, 3, tIdle, sineOut);
	b.wait(tIdle);

	// -> UK
	b.pan(1981, 405, tMove);
	b.zoom(9, tMove);
	b.wait();
	b.panBy(-2, -2, tIdle, sineOut);
	b.zoomBy(0.98, tIdle, sineOut);
	b.wait(tIdle);

	// -> Iceland
	b.pan(1834, 285, tMove);
	b.zoom(13.2, tMove, backIn);
	b.wait();
	b.zoomBy(1.04, tIdle, backOut);
	b.wait(tIdle);

	// -> central Europe zoomed out
	b.pan(2090, 443, tMove * 2);
	b.zoom(3, tMove * 2);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(2, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> north Europe
	b.pan(2155, 408, tMove, backInOut);
	b.zoom(7.5, tMove, sineIn);
	b.wait();
	b.zoomBy(1.17, tIdle, sineOut);
	b.panBy(2, -3, tIdle, sineOut);
	b.wait(tIdle);

	// -> northwest Mediterranean
	b.pan(2176, 510, tMove, quadInOut);
	b.zoom(10.5, tMove + tIdle, quartIn);
	b.wait(tMove);
	b.panBy(1, 4, tIdle, sineOut);
	b.wait(tIdle);

	// -> Mediterranean zoomed out
	b.pan(2223, 574, tMove);
	b.zoom(3.8, tMove, quartOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(3, 5, tIdle, sineOut);
	b.wait(tIdle);

	// -> Scandanavia
	b.pan(2322, 337, tMove);
	b.zoom(4.3, tMove, backInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, -4, tIdle, sineOut);
	b.wait(tIdle);

	// -> north east Europe zoomed out
	b.pan(2657, 323, tMove);
	b.zoom(1.7, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.wait(tIdle);

	// -> Black Sea and Caspian Sea
	b.pan(2546, 497, tMove);
	b.zoom(4.2, tMove);
	b.wait();
	b.zoomBy(1.03, tIdle, sineOut);
	b.panBy(-1, 3, tIdle, sineOut);
	b.wait(tIdle);

	// -> Middle East
	b.pan(2577, 741, tMove * 2);
	b.zoom(2.9, tMove * 2, backInOut);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait(tIdle);

	// -> west south Asia
	b.pan(2821, 824, tMove);
	b.zoom(3.7, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(2, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> Bangladesh
	b.pan(3097, 770, tMove);
	b.zoom(6.7, tMove, backInOut);
	b.wait();
	b.panBy(6, -1, tIdle, sineOut);
	b.zoomBy(0.98, tIdle, sineOut);
	b.wait(tIdle);

	// -> south Asia
	b.pan(3191, 870, tMove);
	b.zoom(3.3, tMove, sineOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(2, 2, tIdle, sineOut);
	b.wait(tIdle);

	// -> south east Asia and Melanesia
	b.pan(3514, 984, tMove * 2);
	b.zoom(2.45, tMove * 2, backInOut);
	b.wait();
	b.zoomBy(1.01, tIdle, sineOut);
	b.panBy(2, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> Australia
	b.pan(3589, 1332, tMove);
	b.zoom(2.8, tMove, backInOut);
	b.wait();
	b.zoomBy(0.99, tIdle, sineOut);
	b.panBy(1, 3, tIdle, sineOut);
	b.wait(tIdle);

	// -> Polynesia (not all of it unfortunately, and zoomed out - resolution is too coarse for a good experience)
	b.pan(4177, 1357, tMove);
	b.zoom(2.3, tMove, backInOut);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(3, 0, tIdle, sineOut);
	b.wait(tIdle);

	// south east Asia and Australia zoomed out
	b.pan(3600, 1107, tMove, sineIn);
	b.zoom(1.2, tMove);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(-16, -16, tIdle, sineOut);
	b.wait(tIdle);

	// -> east Asia
	b.pan(3335, 675, tMove);
	b.zoom(3.5, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(-1, -2, tIdle, sineOut);
	b.wait(tIdle);

	// -> north east east Asia
	b.pan(3595, 588, tMove);
	b.zoom(5.6, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(1, 0, tIdle, sineOut);
	b.wait(tIdle);

	// -> east Asia zoomed out
	b.pan(3465, 612, tMove * 2, backInOut);
	b.zoom(1, tMove * 2);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(-2, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> Hawaii
	b.pan(4359, 788, tMove);
	b.zoom(13, tMove, quintIn);
	b.wait();
	b.zoomBy(1.22, tIdle, sineOut);
	b.panBy(2, 0, tIdle, sineOut);
	b.wait(tIdle);

	// -> Bering Strait
	b.pan(4136, 306, tMove);
	b.zoom(3, tMove, quintOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(-2, -7, tIdle, sineOut);
	b.wait(tIdle);

	// -> north Canada
	b.pan(5043, 281, tMove + tIdle); // move a tad slower, this is a rough one, pls don't get seasick
	b.zoom(2, tMove + tIdle, backInOut);
	b.wait();
	b.zoomBy(1.03, tIdle, sineOut);
	b.panBy(4, 0, tIdle, sineOut);
	b.wait(tIdle);

	// -> pacific Northwest
	b.pan(4743, 478, tMove);
	b.zoom(9.1, tMove, quintIn);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(-1, 3, tIdle, sineOut);
	b.wait(tIdle);

	// -> west North America
	b.pan(4775, 578, tMove);
	b.zoom(10.1, tMove);
	b.wait();
	b.zoomBy(1.05, tIdle, sineOut);
	b.panBy(0, 3, tIdle, sineOut);
	b.wait(tIdle);

	// -> southwest North America
	b.pan(4833, 674, tMove);
	b.zoom(4.2, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> Mexico
	b.pan(4999, 732, tMove);
	b.zoom(4.6, tMove, backInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(3, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> south east North America
	b.pan(5160, 673, tMove);
	b.zoom(6.8, tMove);
	b.wait();
	b.zoomBy(1.03, tIdle, sineOut);
	b.wait(tIdle);

	// -> north east North America
	b.pan(5297, 549, tMove);
	b.zoom(4.7, tMove, backInOut);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(1, -4, tIdle, sineOut);
	b.wait(tIdle);

	// -> Carribbean
	b.pan(5290, 776, tMove);
	b.zoom(5.6, tMove, backInOut);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait(tIdle);

	// -> Central America
	b.pan(5176, 872, tMove);
	b.zoom(4.7, tMove);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(0, 2, tIdle, sineOut);
	b.wait(tIdle);

	// -> northern South America
	b.pan(5395, 908, tMove);
	b.zoom(5.6, tMove, backInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(3, 0, tIdle, sineOut);
	b.wait(tIdle);

	// -> Brazil
	b.pan(5510, 1052, tMove);
	b.zoom(5.1, tMove, backInOut);
	b.wait();
	b.zoomBy(0.98, tIdle, sineOut);
	b.panBy(1, 1, tIdle, sineOut);
	b.wait(tIdle);

	// -> north South America zoomed out
	b.pan(5444, 1123, tMove);
	b.zoom(2.2, tMove);
	b.wait();
	b.zoomBy(0.97, tIdle, sineOut);
	b.wait(tIdle);

	// -> south Source America
	b.pan(5523, 1450, tMove);
	b.zoom(2.6, tMove);
	b.wait();
	b.zoomBy(1.02, tIdle, sineOut);
	b.panBy(1, 4, tIdle, sineOut);
	b.wait(tIdle);

	// -> equator zoomed out
	b.pan(5163, 1016, tMove * 2, backInOut);
	b.zoom(0.6, tMove * 2);
	b.wait();

	// -> disappear zooming into the Mariana Trench
	// TODO validate that there's enough time to finish the end sequence
	b.pan(7764, 895, tEndSequence);
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
