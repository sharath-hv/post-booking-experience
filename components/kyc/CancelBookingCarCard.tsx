"use client";

import Image from "next/image";

import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  getBookingDeliveryIconSrc,
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import type { CancelBookingCarDetails } from "@/lib/cancel-booking-content";
import { getModifySelectionCarCutoutForColour } from "@/lib/modify-selection-car-cutouts";
import { cn } from "@/lib/utils";
import styles from "./CancelBookingCarCard.module.scss";


type CancelBookingCarCardProps = {
  details: CancelBookingCarDetails;
};

/**
 * Compact booked-car card — Figma Post-booking-experience / node 2709:17397.
 */
export function CancelBookingCarCard({ details }: CancelBookingCarCardProps) {
  const carCutoutSrc =
    details.colourId != null
      ? getModifySelectionCarCutoutForColour(details.colourId)
      : BOOKING_CONFIRMED_ASSETS.carCutout;
  const deliveryTextClass = details.isExpressDelivery
    ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
    : BOOKING_STANDARD_DELIVERY_TEXT_CLASS;
  const deliveryIconSrc = details.isExpressDelivery
    ? BOOKING_CONFIRMED_ASSETS.expressDelivery
    : getBookingDeliveryIconSrc("standard");
  const deliveryParts = splitBookingDeliveryLine(details.deliveryLine);

  return (
    <div className={[styles.flex_0, "card-elevated"].filter(Boolean).join(" ")}>
      <div className={styles.relative_1}>
        <Image
          src={carCutoutSrc}
          alt=""
          fill
          className={styles.object_contain_2}
          sizes="84px"
          unoptimized
        />
      </div>
      <div className={styles.min_w_0_3}>
        <p className={styles.text_sm_4}>{details.carTitle}</p>
        <p className={styles.mt_0_5_5}>{details.carVariant}</p>
        <p className={styles.text_xs_6}>{details.carColor}</p>
        <div className={styles.mt_1_7}>
          <p className={cn(styles.text_xs_10, deliveryTextClass)}>
            {deliveryParts ? (
              <>
                {deliveryParts.prefix}
                <span>{deliveryParts.date}</span>
              </>
            ) : (
              details.deliveryLine
            )}
          </p>
          <span className={styles.relative_8} aria-hidden>
            <Image
              src={deliveryIconSrc}
              alt=""
              width={16}
              height={16}
              className={styles.h_4_9}
              unoptimized
              sizes="16px"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
