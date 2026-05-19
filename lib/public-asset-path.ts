/**
 * Paths for files under `public/assets/`.
 * Must stay in sync with `basePath` in `next.config.ts` (GitHub project Pages).
 */
export const BASE_PATH = "/post-booking-experience";

/** e.g. `public/assets/KYC.svg` → `/post-booking-experience/assets/KYC.svg` */
export function publicAssetPath(filename: string): string {
  return `${BASE_PATH}/assets/${encodeURIComponent(filename)}`;
}

/** e.g. `public/assets/kyc-booking-confirmed/car-cutout.png` */
export function publicAssetPathIn(subfolder: string, filename: string): string {
  return `${BASE_PATH}/assets/${subfolder}/${encodeURIComponent(filename)}`;
}
