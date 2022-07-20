import {writable, type Writable} from 'svelte/store';

import type {TourData, TourStore} from '$lib/app/tour';
import type {Camera2} from '$lib/app/camera2';

export interface DeepBreathTourManager {
	camera: Camera2;
	tour: Writable<TourStore | null>;
	tourData: Writable<TourData | null>;
	showTourIntro: Writable<boolean>;
	showTourTitle: Writable<boolean>;
	showTourCredits: Writable<boolean>;
}

export const createDeepBreathTourManager = (camera: Camera2): DeepBreathTourManager => {
	const tourManager: DeepBreathTourManager = {
		camera,
		tour: writable(null),
		tourData: writable(null),
		showTourIntro: writable(false),
		showTourTitle: writable(false),
		showTourCredits: writable(false),
		beginTour: () => {
			// TODO BLOCK does this belong here or in `DeepBreathTour`?
		},
	};

	return tourManager;
};
