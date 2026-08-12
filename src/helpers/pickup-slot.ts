/**
 * Locked pickup slot from the delivery-schedule climax turn.
 * Used on the schedule artifact card and the manage-booking car card
 * (schedule stage only).
 */

const PICKUP_DELIVERY_LINE_KEY = "pbe_locked_pickup_delivery_line_v1";

/** Card / menu line — day + time range only (period of day is implied). */
export function formatPickupDeliveryLine(day: string, timeRange: string): string {
  return `Pickup ${day} · ${timeRange}`;
}

export function readLockedPickupDeliveryLine(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(PICKUP_DELIVERY_LINE_KEY);
    return value != null && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

export function writeLockedPickupDeliveryLine(line: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PICKUP_DELIVERY_LINE_KEY, line);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearLockedPickupDeliveryLine(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PICKUP_DELIVERY_LINE_KEY);
  } catch {
    /* ignore */
  }
}
