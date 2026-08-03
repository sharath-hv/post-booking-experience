/**
 * Demo affordance — choose aurora CSS mesh vs looping video backdrop.
 * Persisted in sessionStorage; toggled from the manage-booking menu.
 */

export type BackdropMode = "aurora" | "video";

const BACKDROP_MODE_KEY = "pbe-backdrop-mode";
export const BACKDROP_MODE_CHANGE_EVENT = "pbe-backdrop-change";

export function readBackdropMode(): BackdropMode {
  if (typeof window === "undefined") return "aurora";
  try {
    return sessionStorage.getItem(BACKDROP_MODE_KEY) === "video" ? "video" : "aurora";
  } catch {
    return "aurora";
  }
}

export function writeBackdropMode(mode: BackdropMode): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(BACKDROP_MODE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent(BACKDROP_MODE_CHANGE_EVENT, { detail: mode }));
}
