"use client";

import Image, { type StaticImageData } from "next/image";

import {
  BookingCarCardDetails,
  type BookingCarCardDetailsProps,
} from "@/components/kyc/BookingCarCardDetails";
import {
  DEMO_VEHICLE_CHASSIS_NO,
  DEMO_VEHICLE_ENGINE_NO,
} from "@/components/kyc/demo-vehicle-identification";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import { cn } from "@/lib/utils";
import styles from "./BookingCarSummaryCard.module.scss";


type CarCutoutSrc = string | StaticImageData;

/** Figma 2903:8621 — outer card shell. */
export const BOOKING_CAR_CARD_SHELL_CLASS = styles.bookingCarCardShell + " card-elevated";

/** Figma 2903:8621 — non-VIN hero card height. */
export const BOOKING_CAR_HERO_HEIGHT_CLASS = styles.bookingCarHeroHeight;

/** Figma 2903:8621 — VIN card minimum height. */
export const BOOKING_CAR_HERO_HEIGHT_VIN_CLASS = styles.bookingCarHeroHeightVin;

/** Figma 2903:8655 — floating details panel. */
export const BOOKING_CAR_SUMMARY_PANEL_CLASS = styles.bookingCarSummaryPanel;

/** Figma 2903:8655 — panel anchored above card bottom (8px inset matches 304px on 320px frame). */
export const BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS = styles.bookingCarSummaryPanelPosition;

/** VIN / tall hero — floating panel over the cutout (negative margin). */
export const BOOKING_CAR_SUMMARY_PANEL_OVER_HERO_CLASS = styles.relative_1;

/** Figma 2903:8649 — showroom backdrop fade. */
export const BOOKING_CAR_BACKDROP_GRADIENT =
  "linear-gradient(180deg, rgba(255, 255, 255, 0) 32.597%, rgb(255, 255, 255) 81.238%), linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 9.5304%)";

export function BookingCarCardBackdrop() {
  return (
    <div
      aria-hidden
      className={styles.pointer_events_none_0}
    >
      {/* Scale by width only — top edge stays fixed as the card grows wider. */}
      <Image
        src={BOOKING_CONFIRMED_ASSETS.cardBackdrop}
        alt=""
        className={styles.block_1}
        sizes="(max-width: 640px) 100vw, 640px"
        unoptimized
      />
      <div
        className={styles.absolute_2}
        style={{ backgroundImage: BOOKING_CAR_BACKDROP_GRADIENT }}
      />
    </div>
  );
}

export function BookingCarSummaryCardVisualStage({
  carCutoutSrc = BOOKING_CONFIRMED_ASSETS.carCutout,
  showBackdrop = true,
}: {
  carCutoutSrc?: CarCutoutSrc;
  /** When false, only the cutout renders (backdrop lives on the outer card). */
  showBackdrop?: boolean;
}) {
  return (
    <>
      {showBackdrop ? <BookingCarCardBackdrop /> : null}

      <div className={styles.absolute_3}>
        <div className={styles.relative_4}>
          <Image
            src={carCutoutSrc}
            alt=""
            fill
            className={styles.object_contain_5}
            sizes="150px"
            unoptimized
          />
        </div>
      </div>
    </>
  );
}

type BookingCarSummaryCardProps = {
  /** When true, shows engine/chassis rows (post–car-allocation manage booking). */
  showVehicleIdentification?: boolean;
  /** `hero` — backdrop + cutout; `detailsOnly` — copy panel only (modify-selection). */
  variant?: "hero" | "detailsOnly";
  /** Overrides for the details panel (e.g. selected colour on modify confirm). */
  cardDetails?: Pick<
    BookingCarCardDetailsProps,
    | "carColor"
    | "carTitle"
    | "carVariant"
    | "deliveryLine"
    | "deliveryTextClass"
    | "deliveryIconSrc"
  >;
  /** Paint-specific cutout on hero card (modify-selection confirm). */
  carCutoutSrc?: CarCutoutSrc;
};

/**
 * Booked-car summary — hero card (manage booking) or details-only panel (modify-selection).
 */
export function BookingCarSummaryCard({
  showVehicleIdentification = false,
  variant = "hero",
  cardDetails,
  carCutoutSrc,
}: BookingCarSummaryCardProps) {
  const details = (
    <BookingCarCardDetails
      engineNo={showVehicleIdentification ? DEMO_VEHICLE_ENGINE_NO : undefined}
      chassisNo={showVehicleIdentification ? DEMO_VEHICLE_CHASSIS_NO : undefined}
      showCopyButtons={showVehicleIdentification}
      {...cardDetails}
    />
  );

  if (variant === "detailsOnly") {
    return (
      <section
        className={styles.w_full_6}
        aria-label="Your booked car"
      >
        {details}
      </section>
    );
  }

  if (showVehicleIdentification) {
    return (
      <div
        className={cn(BOOKING_CAR_CARD_SHELL_CLASS, styles.w_full_7, BOOKING_CAR_HERO_HEIGHT_VIN_CLASS)}
      >
        <BookingCarCardBackdrop />
        <div className={cn(styles.relative_0, BOOKING_CAR_HERO_HEIGHT_CLASS)}>
          <BookingCarSummaryCardVisualStage carCutoutSrc={carCutoutSrc} showBackdrop={false} />
        </div>
        <div className={cn(styles.relative_1, BOOKING_CAR_SUMMARY_PANEL_CLASS)}>
          {details}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(BOOKING_CAR_CARD_SHELL_CLASS, styles.w_full_7, BOOKING_CAR_HERO_HEIGHT_CLASS)}
    >
      <BookingCarSummaryCardVisualStage carCutoutSrc={carCutoutSrc} />
      <div className={cn(BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS, BOOKING_CAR_SUMMARY_PANEL_CLASS)}>
        {details}
      </div>
    </div>
  );
}
