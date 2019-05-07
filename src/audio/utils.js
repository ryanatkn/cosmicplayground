// Convert a user-facing volume value [0,1] to the actual gain value.
// We want some sort of nonlinear curve to match user expectations.
// TODO why is this exponent so different from the article?
// https://www.dr-lex.be/info-stuff/volumecontrols.html
export const volumeToGain = volume => {
  return Math.pow(volume, 2.7);
};

export const SMOOTH_GAIN_TIME_CONSTANT = 0.03;