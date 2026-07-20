import timeDeliveryIcon from "@/assets/Time.svg";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import { BOOKING_EXPRESS_DELIVERY_LINE } from "@/components/kyc/booking-car-card-content";
import styles from "./experience-flow-content.module.scss";

import {
  readExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";

/** Standard delivery — update when product copy is final. */
export const BOOKING_STANDARD_DELIVERY_LINE = "Standard delivery by 25 Oct '26";

/** Delivery line colour on car cards — standard vs express. */
export const BOOKING_STANDARD_DELIVERY_TEXT_CLASS = styles.bookingStandardDeliveryText;
export const BOOKING_EXPRESS_DELIVERY_TEXT_CLASS = styles.bookingExpressDeliveryText;

const BOOKING_DELIVERY_LINE_BY_DATE = /^(.*? by )(.+)$/;

/** Splits copy like `Express delivery by 10 Jun '25` into prefix + date. */
export function splitBookingDeliveryLine(
  deliveryLine: string,
): { prefix: string; date: string } | null {
  const match = deliveryLine.match(BOOKING_DELIVERY_LINE_BY_DATE);
  if (!match) return null;
  return { prefix: match[1], date: match[2] };
}

export function isStandardDeliveryFlow(flow?: ExperienceFlow): boolean {
  const active = flow ?? readExperienceFlow();
  return active === "standard";
}

export function isExpressDeliveryFlow(flow?: ExperienceFlow): boolean {
  const active = flow ?? readExperienceFlow();
  return active === "express";
}

/** Delivery line on car cards — standard-only vs express (default for other flows). */
export function getBookingDeliveryLine(flow?: ExperienceFlow): string {
  return isStandardDeliveryFlow(flow)
    ? BOOKING_STANDARD_DELIVERY_LINE
    : BOOKING_EXPRESS_DELIVERY_LINE;
}

/** Delivery icon on car cards — standard uses clock; express uses bolt. */
export function getBookingDeliveryIconSrc(flow?: ExperienceFlow) {
  return isStandardDeliveryFlow(flow)
    ? timeDeliveryIcon
    : BOOKING_CONFIRMED_ASSETS.expressDelivery;
}

/** Text colour class for the delivery line on car cards. */
export function getBookingDeliveryTextClass(flow?: ExperienceFlow): string {
  return isStandardDeliveryFlow(flow)
    ? BOOKING_STANDARD_DELIVERY_TEXT_CLASS
    : BOOKING_EXPRESS_DELIVERY_TEXT_CLASS;
}

/** Delivery strip on car cards — express lavender tint vs standard neutral. */
export const BOOKING_EXPRESS_DELIVERY_STRIP_CLASS = styles.bookingExpressDeliveryStrip;
export const BOOKING_STANDARD_DELIVERY_STRIP_CLASS = styles.bookingStandardDeliveryStrip;

export function getBookingDeliveryStripContainerClass(flow?: ExperienceFlow): string {
  return isStandardDeliveryFlow(flow)
    ? BOOKING_STANDARD_DELIVERY_STRIP_CLASS
    : BOOKING_EXPRESS_DELIVERY_STRIP_CLASS;
}

const CAR_ALLOCATION_PENDING_SUBLINE =
  "We're allocating your exact Creta variant and colour. This usually takes 24-48 hours.";

/** Car allocation pending subline — same copy for express and standard. */
export function getCarAllocationPendingSubline(_flow?: ExperienceFlow): string {
  return CAR_ALLOCATION_PENDING_SUBLINE;
}

/** Info callout on car allocation pending. */
export const CAR_ALLOCATION_PENDING_INFO_BOX_EXPRESS =
  "Once allocated, you will receive your car's engine and chassis number.";
