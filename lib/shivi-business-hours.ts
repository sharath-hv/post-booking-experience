/** Shivi callback availability — India business hours (IST). */
export const SHIVI_TIME_ZONE = "Asia/Kolkata";

/** Inclusive start hour (0–23) in `SHIVI_TIME_ZONE`. */
export const SHIVI_BUSINESS_HOUR_START = 9;

/** Exclusive end hour (0–23) in `SHIVI_TIME_ZONE` — online until this hour. */
export const SHIVI_BUSINESS_HOUR_END = 21;

/**
 * Whether Shivi is within callback business hours (9 AM–9 PM IST, every day).
 * Used for the online indicator on `ShiviCallSheet`.
 */
export function isShiviWithinBusinessHours(now: Date = new Date()): boolean {
  const hourPart = new Intl.DateTimeFormat("en-GB", {
    timeZone: SHIVI_TIME_ZONE,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now).find((part) => part.type === "hour");

  const hour = Number(hourPart?.value ?? Number.NaN);
  if (!Number.isFinite(hour)) return false;
  return hour >= SHIVI_BUSINESS_HOUR_START && hour < SHIVI_BUSINESS_HOUR_END;
}
