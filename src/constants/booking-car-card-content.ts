/** Shared copy for booking / manage-booking car summary cards. */
export const DEMO_BOOKING_ID = "AD-1322";
export const BOOKING_CAR_TITLE = "Hyundai Creta";
export const BOOKING_CAR_VARIANT = "1.5 X-Line AT Diesel";
export const BOOKING_CAR_COLOR = "Starry Night";
export const BOOKING_EXPRESS_DELIVERY_LINE = "Express delivery by 10 Jun '25";

export type BookingCarCardDetailsProps = {
  /** When set with `chassisNo`, shows engine/chassis below the delivery line. */
  engineNo?: string;
  chassisNo?: string;
  /** Registration number — only after RTO (shown above engine). */
  registrationNo?: string;
  /** Override paint name (e.g. modify-selection colour confirm). */
  carColor?: string;
  /** Override variant label (e.g. modify-selection variant confirm). */
  carVariant?: string;
  /** Override model title (e.g. different-car modify-selection). */
  carTitle?: string;
  deliveryLine?: string;
  deliveryTextClass?: string;
  deliveryIconSrc?: string;
};
