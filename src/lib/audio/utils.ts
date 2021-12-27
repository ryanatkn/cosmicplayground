// Convert a user-facing volume value [0,1] to the actual gain value.
// We want some sort of nonlinear curve to match user expectations.
// TODO why is this exponent so different from the article?
// https://www.dr-lex.be/info-stuff/volumecontrols.html
export const VOLUME_TO_GAIN_EXPONENT = 2.2;
export const volumeToGain = (volume: number): number => {
	return Math.pow(volume, VOLUME_TO_GAIN_EXPONENT);
};

export const SMOOTH_GAIN_TIME_CONSTANT = 0.03;
