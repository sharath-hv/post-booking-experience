"use client";

import Image from "next/image";

import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import { VehicleIdentificationRows } from "@/components/kyc/VehicleIdentificationRows";
import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/components/kyc/booking-car-card-content";
import {
  getBookingDeliveryIconSrc,
  getBookingDeliveryLine,
  getBookingDeliveryTextClass,
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import { cn } from "@/lib/utils";
import styles from "./BookingCarCardDetails.module.scss";


export type BookingCarCardDetailsProps = {
  /** When set with `chassisNo`, shows engine/chassis below the delivery line. */
  engineNo?: string;
  chassisNo?: string;
  showCopyButtons?: boolean;
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

/**
 * Car title, variant/color, delivery line (express vs standard), and optional VIN rows —
 * shared by manage-booking sheet and celebration success cards.
 */
export function BookingCarCardDetails({
  engineNo,
  chassisNo,
  showCopyButtons = false,
  carColor,
  carVariant,
  carTitle,
  deliveryLine,
  deliveryTextClass,
  deliveryIconSrc,
}: BookingCarCardDetailsProps) {
  const showVehicleIdentification =
    engineNo != null &&
    engineNo.length > 0 &&
    chassisNo != null &&
    chassisNo.length > 0;
  const titleLabel = carTitle ?? BOOKING_CAR_TITLE;
  const variantLabel = carVariant ?? BOOKING_CAR_VARIANT;
  const colorLabel = carColor ?? BOOKING_CAR_COLOR;
  const resolvedDeliveryLine = deliveryLine ?? getBookingDeliveryLine();
  const resolvedDeliveryTextClass = deliveryTextClass ?? getBookingDeliveryTextClass();
  const resolvedDeliveryIconSrc = deliveryIconSrc ?? getBookingDeliveryIconSrc();
  const deliveryParts = splitBookingDeliveryLine(resolvedDeliveryLine);

  return (
    <>
      <p className={styles.text_base_0}>{titleLabel}</p>
      <div className={styles.mt_1_1}>
        <span className={styles.shrink_0_2}>{variantLabel}</span>
        <span
          className={styles.inline_flex_3}
          aria-hidden
        >
          <Image
            src={BOOKING_CONFIRMED_ASSETS.dotSeparator}
            alt=""
            width={16}
            height={16}
            className={styles.block_4}
            unoptimized
            sizes="16px"
          />
        </span>
        <span className={styles.shrink_0_2}>{colorLabel}</span>
      </div>
      <div className={styles.mt_2_5}>
        <p className={cn(styles.text_xs_8, resolvedDeliveryTextClass)}>
          {deliveryParts ? (
            <>
              {deliveryParts.prefix}
              <span>{deliveryParts.date}</span>
            </>
          ) : (
            resolvedDeliveryLine
          )}
        </p>
        <span className={styles.relative_6} aria-hidden>
          <Image
            src={resolvedDeliveryIconSrc}
            alt=""
            width={16}
            height={16}
            className={styles.h_4_7}
            unoptimized
            sizes="16px"
          />
        </span>
      </div>
      {showVehicleIdentification ? (
        <VehicleIdentificationRows
          engineNo={engineNo}
          chassisNo={chassisNo}
          showCopyButtons={showCopyButtons}
        />
      ) : null}
    </>
  );
}
