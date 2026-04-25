/**
 * Booking confirmed — self-hosted under `/public/assets/kyc-booking-confirmed/`
 * (copied from Figma MCP; avoids cold CDN latency).
 */
const asset = (filename: string) => `/assets/kyc-booking-confirmed/${encodeURIComponent(filename)}`;

export const BOOKING_CONFIRMED_ASSETS = {
  cardBackdrop: asset("card-backdrop.png"),
  carCutout: asset("car-cutout.png"),
  dotSeparator: asset("dot-separator.png"),
  /** Express delivery bolt — `express-delivery.svg` under this folder. */
  expressDelivery: asset("express-delivery.svg"),
} as const;
