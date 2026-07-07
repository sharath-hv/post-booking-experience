/**
 * Site-wide defaults. The app is served from the domain root (Vercel) —
 * no base path. `next.config.ts`, `publicAssetPath()`, and route
 * normalization all read from here.
 */
export const BASE_PATH = "/post-booking-experience";

/** Production static export is the default build target for this project. */
export const STATIC_EXPORT_ENABLED = true;
