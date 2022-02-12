// TODO make this a store instead of non-reactive singleton?
// this module is a haphazard mess but that's ok for now

const verboseLogging = false; // TODO settings? log level?

interface RenderStats {
	totalTime: number;
	droppedFrames: number;
}

const defaultRenderStats = (): RenderStats => ({totalTime: 0, droppedFrames: 0});

let renderStats: RenderStats = defaultRenderStats();

export const updateRenderStats = (dt: number): void => {
	const droppedFrames = computeDroppedFrames(dt);
	// TODO mutate like this or not?
	renderStats.totalTime += dt;
	if (droppedFrames) {
		renderStats.droppedFrames += droppedFrames;
		if (verboseLogging) logDroppedFrames(dt, droppedFrames); // TODO move flag to settings?
	}
};

export const resetRenderStats = (): RenderStats => (renderStats = defaultRenderStats());

export const getRenderStats = (): RenderStats => renderStats;

const expectedFps = 60; // TODO support other framerates?
const expectedMsPerFrame = 1000 / expectedFps;

const computeDroppedFrames = (dt: number): number => {
	if (dt > expectedMsPerFrame * 2 - 5) {
		// TODO improve?
		return Math.round((10 * (dt - expectedMsPerFrame)) / expectedMsPerFrame) / 10;
	}
	return 0;
};

const logDroppedFrames = (dt: number, droppedFrames: number): void => {
	console.warn(
		`(╯°□°)╯︵ ┻━┻ ${droppedFrames} frame${droppedFrames === 1 ? '' : 's'} over ${dt.toFixed(1)}ms`,
	);
};
