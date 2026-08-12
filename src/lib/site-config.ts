/**
 * Site-wide defaults. The app is served from the domain root (Vercel) —
 * no base path. `next.config.ts`, `publicAssetPath()`, and route
 * normalization all read from here.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Production static export is the default build target for this project. */
export const STATIC_EXPORT_ENABLED = true;
