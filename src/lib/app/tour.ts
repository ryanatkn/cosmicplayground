// TODO I was expecting this to typecheck if declared in `Tour.svelte` in
// `<script context="module" lang="ts">` but it's not working when importing from ts modules.
// (vscode doesn't complain tho?)

export interface TourData {
	totalDuration: number;
	steps: TourStep[];
}

export type TourStep = PanTourStep | ZoomTourStep | EventTourStep | WaitForEventTourStep;
export type TourStepType = TourStep['type'];
export interface TourStepBase {
	duration: number;
	startTime: number;
	index: number;
}
export interface PanTourStep extends TourStepBase {
	type: 'pan';
	easing: (t: number) => number;
	x: number;
	y: number;
}
export interface ZoomTourStep extends TourStepBase {
	type: 'zoom';
	easing: (t: number) => number;
	scale: number;
}
export interface EventTourStep extends TourStepBase {
	type: 'event';
	duration: 0;
	name: string;
	data: unknown;
}
export interface WaitForEventTourStep extends TourStepBase {
	type: 'waitForEvent';
	duration: 0;
	name: string;
}

export interface TourHooks {
	pan: (x: number, y: number, duration: number, easing: (t: number) => number) => void;
	zoom: (scale: number, duration: number, easing: (t: number) => number) => void;
	event: (name: string, data: unknown) => void | Promise<void>;
	seek: (currentTime: number, currentStepIndex: number) => void; // TODO should this be `onSeek` instead?
	done: (completed: boolean) => void;
}

export const findTourStep = (tourData: TourData, name: string): TourStep => {
	const step = tourData.steps.find((s) => 'name' in s && s.name === name);
	if (!step) throw Error(`Failed to find tour step with name ${name}`);
	return step;
};

export const findMostRecentStepOfType = <T extends TourStep>(
	steps: TourStep[],
	type: T['type'],
	startIndex: number = steps.length - 1,
): T | undefined => {
	for (let i = startIndex; i >= 0; i--) {
		const step = steps[i];
		if (step.type === type) return step as T;
	}
	return undefined;
};

export const updateAudioOnSeek = (
	audio: HTMLAudioElement,
	step: TourStep,
	currentTime: number,
	audioEnabled: boolean,
	paused: boolean,
): void => {
	const stepCurrentTime = currentTime - step.startTime;
	const audioDuration = audio.duration * 1000;
	if (stepCurrentTime >= 0 && stepCurrentTime < audioDuration) {
		audio.currentTime = stepCurrentTime / 1000;
		if (paused) {
			if (!audio.paused) audio.pause();
		} else if (audio.paused && audioEnabled) {
			void audio.play();
		}
	} else if (!audio.paused) {
		audio.pause();
	}
};
