"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import cretaCutout from "@/assets/Hyundai Creta.png";
import ackoDriveWordmark from "@/assets/ACKO Drive wordmark.svg";
import tickIcon from "@/assets/tick.svg";
import { IconWell } from "@/components/molecules/IconWell";
import { BookingCarCardDetails } from "@/components/organisms/BookingCarCardDetails";
import {
  BOOKING_CAR_CARD_SHELL_CLASS,
  BOOKING_CAR_HERO_HEIGHT_CLASS,
  BOOKING_CAR_HERO_HEIGHT_VIN_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS,
  BookingCarCardBackdrop,
  BookingCarSummaryCardVisualStage,
} from "@/components/organisms/BookingCarSummaryCard";
import { cn } from "@/utils/utils";
import styles from "./CarSummaryCardLite.module.scss";

const TICK_ICON_MASK_STYLE = {
  maskImage: `url(${tickIcon.src})`,
  WebkitMaskImage: `url(${tickIcon.src})`,
} satisfies CSSProperties;

export type CarSummaryCardLiteProps = {
  title: string;
  variant: string;
  colour: string;
  /** e.g. “Express delivery by 10 Jun '25”. */
  deliveryLine?: string;
  deliveryLineClassName?: string;
  /** Strip container classes — express lavender vs standard neutral. */
  deliveryStripClassName?: string;
  /** Bolt (express) or clock (standard). */
  deliveryIconSrc?: StaticImageData | string;
  /** Who has it (dealer attribution row). */
  dealerName?: string;
  dealerDetail?: string;
  /** `dealer` leads with the dealer (e.g. “found it” — the dealer is the news). */
  hero?: "car" | "dealer";
  /** Green status chip at card top — e.g. “Locked to you ✓”. */
  statusChip?: string;
  /** Colour of the status chip. Defaults to "green". */
  statusChipVariant?: "green" | "blue";
  /** Post-allocation identity — the exact unit. */
  engineNo?: string;
  chassisNo?: string;
  /** Post-RTO registration number. */
  registrationNo?: string;
};

function statusChipLabel(chip: string) {
  return chip.replace(/\s*✓\s*$/, "").trim();
}

function deliveryIconPath(src?: StaticImageData | string) {
  if (!src) return undefined;
  return typeof src === "string" ? src : src.src;
}

/** ACKO Drive attribution row on CarSummaryCardLite — flip to restore. */
const SHOW_CAR_SOURCE_HEADER = false;

/** Compact car card — her find, your car. */
export function CarSummaryCardLite({
  title,
  variant,
  colour,
  deliveryLine,
  deliveryLineClassName = styles.textExpress,
  deliveryStripClassName = styles.stripExpress,
  deliveryIconSrc,
  dealerName,
  dealerDetail,
  statusChip,
  statusChipVariant = "green",
  engineNo,
  chassisNo,
  registrationNo,
}: CarSummaryCardLiteProps) {
  const showHeroLayout = dealerName != null;

  if (!showHeroLayout) {
    return (
      <div className={[styles.overflow_hidden_39, "card-elevated"].filter(Boolean).join(" ")}>
        <div
          className={cn(
            styles.flex_73,
            statusChip ? styles.gap_1_74 : styles.gap_3_75
          )}
        >
          {statusChip ? (
            <span
              className={
                statusChipVariant === "blue"
                  ? styles.inline_flex_6
                  : styles.inline_flex_2
              }
            >
              {statusChipVariant === "blue" ? null : (
                <span
                  aria-hidden
                  className={styles.h_5_40}
                  style={TICK_ICON_MASK_STYLE}
                />
              )}
              {statusChipLabel(statusChip)}
            </span>
          ) : null}
          <div className={styles.flex_41}>
            <div className={styles.min_w_0_42}>
              <p className={styles.text_base_37}>{title}</p>
              <p className={styles.mt_0_5_43}>
                {variant} · {colour}
              </p>
            </div>
            <div className={styles.relative_44}>
              <Image
                src={cretaCutout}
                alt={title}
                fill
                className={styles.object_contain_1}
                unoptimized
                sizes="110px"
              />
            </div>
          </div>
        </div>
        {engineNo || chassisNo ? (
          <div className={styles.border_t_45}>
            {engineNo ? (
              <div className={styles.flex_46}>
                <span className={styles.text_sm_47}>Engine no.</span>
                <span className={styles.text_sm_10}>
                  {engineNo}
                </span>
              </div>
            ) : null}
            {chassisNo ? (
              <div className={styles.flex_46}>
                <span className={styles.text_sm_47}>Chassis no.</span>
                <span className={styles.text_sm_10}>
                  {chassisNo}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
        {deliveryLine ? (
          <div
            className={cn(
              styles.flex_76,
              deliveryStripClassName,
              deliveryLineClassName
            )}
          >
            {deliveryIconSrc ? (
              <Image
                src={deliveryIconSrc}
                alt=""
                width={14}
                height={14}
                className={styles.h_3_5_48}
                unoptimized
                aria-hidden
              />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className={styles.shrink_0_16}>
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
              </svg>
            )}
            <span className={styles.text_xs_49}>{deliveryLine}</span>
          </div>
        ) : null}
      </div>
    );
  }

  const showVehicleIdentification = Boolean(engineNo && chassisNo);
  const carDetails = (
    <BookingCarCardDetails
      carTitle={title}
      carVariant={variant}
      carColor={colour}
      deliveryLine={deliveryLine}
      deliveryTextClass={deliveryLineClassName}
      deliveryIconSrc={deliveryIconPath(deliveryIconSrc)}
      engineNo={engineNo}
      chassisNo={chassisNo}
      registrationNo={registrationNo}
    />
  );

  return (
    <div
      className={cn(
        BOOKING_CAR_CARD_SHELL_CLASS,
        showVehicleIdentification && BOOKING_CAR_HERO_HEIGHT_VIN_CLASS
      )}
    >
      {showVehicleIdentification ? <BookingCarCardBackdrop /> : null}

      {SHOW_CAR_SOURCE_HEADER ? (
        <div className={styles.relative_50}>
          <IconWell aria-hidden>
            <Image src={ackoDriveWordmark} alt="" width={20} height={15} className={styles.h_15px__52} unoptimized />
          </IconWell>
          <div className={styles.min_w_0_42}>
            <p className={styles.text_sm_15}>{dealerName}</p>
            {dealerDetail ? (
              <p className={styles.mt_0_5_43}>{dealerDetail}</p>
            ) : null}
          </div>
          <span
            className={
              statusChip && statusChipVariant === "blue"
                ? styles.shrink_0_7
                : styles.badgeGreen
            }
          >
            {statusChip ? statusChipLabel(statusChip) : "Reserved"}
          </span>
        </div>
      ) : null}

      {showVehicleIdentification ? (
        <>
          <div className={cn(styles.relative_0, BOOKING_CAR_HERO_HEIGHT_CLASS)}>
            <BookingCarSummaryCardVisualStage showBackdrop={false} />
          </div>
          <div className={cn(styles.relative_1, BOOKING_CAR_SUMMARY_PANEL_CLASS)}>
            {carDetails}
          </div>
        </>
      ) : (
        <div className={cn(styles.relative_2, BOOKING_CAR_HERO_HEIGHT_CLASS)}>
          <BookingCarSummaryCardVisualStage />
          <div className={cn(BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS, BOOKING_CAR_SUMMARY_PANEL_CLASS)}>
            {carDetails}
          </div>
        </div>
      )}
    </div>
  );
}
