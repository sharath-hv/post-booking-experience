/**
 * Standard-flow demo: user opts into early delivery after manufacturing
 * finishes ahead of plan. Persists the updated delivery line for the session.
 */

/** ~3 weeks ahead of the standard demo date (25 Oct '26). */
export const EARLY_STANDARD_DELIVERY_LINE = "Standard delivery by 4 Oct '26";

const EARLY_DELIVERY_LINE_KEY = "pbe-early-delivery-line";

export function readEarlyDeliveryLineOverride(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(EARLY_DELIVERY_LINE_KEY);
    return value != null && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

/** Lock in the earlier delivery date (pill, cards, manage layer). */
export function acceptEarlyDelivery(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(EARLY_DELIVERY_LINE_KEY, EARLY_STANDARD_DELIVERY_LINE);
  } catch {
    /* ignore quota / private mode */
  }
}

/** Decline early delivery (or reset) — keep the original standard date. */
export function clearEarlyDeliveryOverride(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(EARLY_DELIVERY_LINE_KEY);
  } catch {
    /* ignore */
  }
}

export function isEarlyDeliveryAccepted(): boolean {
  return readEarlyDeliveryLineOverride() != null;
}
