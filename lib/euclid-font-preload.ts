/** Same origin as `@font-face` URLs in `app/globals.css` — preconnect + preload for faster first paint. */
export const EUCLID_FONT_ORIGIN = "https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev";

const EUCLID_FONT_DIR = `${EUCLID_FONT_ORIGIN}/Euclid%20Font`;

/** Weights most likely needed on first screen (body + headings + buttons). */
export const EUCLID_PRELOAD_FONT_FILES = [
  "EuclidCircularB-Regular.otf",
  "EuclidCircularB-Medium.otf",
  "EuclidCircularB-Semibold.otf",
  "EuclidCircularB-Bold.otf",
] as const;

export function euclidFontHref(filename: string): string {
  return `${EUCLID_FONT_DIR}/${filename}`;
}
