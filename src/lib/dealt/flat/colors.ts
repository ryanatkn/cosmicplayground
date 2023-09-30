// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

export type Hue = number; // [0, 1]
export type Saturation = number; // [0, 1]
export type Lightness = number; // [0, 1]
export type Hsl = readonly [Hue, Saturation, Lightness]; // [0,1]
export type Rgb = readonly [number, number, number]; // [0,255]

export const hueToRgb = (p: number, q: number, t: number): number => {
	if (t < 0) t += 1; // eslint-disable-line no-param-reassign
	if (t > 1) t -= 1; // eslint-disable-line no-param-reassign
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
};

export const rgbToHex = (r: number, g: number, b: number): number => (r << 16) + (g << 8) + b;

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://wikipedia.org/wiki/HSL_color_space.
 * Values r/g/b are in the range [0,255] and
 * returns h/s/l in the range [0,1].
 */
export const rgbToHsl = (r: number, g: number, b: number): Hsl => {
	r /= 255; // eslint-disable-line no-param-reassign
	g /= 255; // eslint-disable-line no-param-reassign
	b /= 255; // eslint-disable-line no-param-reassign
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l: Lightness = (max + min) / 2;
	let h!: Hue, s: Saturation;
	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [h, s, l];
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://wikipedia.org/wiki/HSL_color_space.
 * Values h/s/l are in the range [0,1] and
 * returns r/g/b in the range [0,255].
 */
export const hslToRgb = (h: Hue, s: Saturation, l: Lightness): Rgb => {
	let r: number, g: number, b: number;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export const hslToHex = (h: Hue, s: Saturation, l: Lightness): number =>
	rgbToHex(...hslToRgb(h, s, l));

export const hslToStr = (h: Hue, s: Saturation, l: Lightness): string =>
	`hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
