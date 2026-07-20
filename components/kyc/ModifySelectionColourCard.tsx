"use client";

import Image from "next/image";

import {
  ModifySelectionRadioIndicator,
  modifySelectionSelectableCardClassName,
} from "@/components/kyc/modify-selection-option-card-ui";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  getBookingDeliveryIconSrc,
} from "@/lib/experience-flow-content";
import {
  modifySelectionColourSavingsInr,
  type ModifySelectionColourOption,
} from "@/lib/modify-selection-colours-content";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionColourCard.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

type ModifySelectionColourCardProps = {
  option: ModifySelectionColourOption;
  selected: boolean;
  onSelect?: () => void;
  /** Summary on the confirmation screen — not interactive. */
  readOnly?: boolean;
};

/**
 * Colour option row — Figma node 2672:10452 (modify-selection / change colour).
 */
export function ModifySelectionColourCard({
  option,
  selected,
  onSelect,
  readOnly = false,
}: ModifySelectionColourCardProps) {
  const savingsInr = modifySelectionColourSavingsInr(option);
  const deliveryIconSrc = option.isExpressDelivery
    ? BOOKING_CONFIRMED_ASSETS.expressDelivery
    : getBookingDeliveryIconSrc("standard");
  const deliveryTextClass = option.isExpressDelivery
    ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
    : BOOKING_STANDARD_DELIVERY_TEXT_CLASS;

  const cardClassName = modifySelectionSelectableCardClassName(selected, readOnly, styles.p4);

  const cardBody = (
    <div className={styles.flex_0}>
      <div className={styles.flex_1}>
        <div
          className={styles.size_12_2}
          aria-hidden
        >
          <div className={styles.size_full_3} style={{ background: option.swatchBackground }} />
        </div>

        <div className={styles.min_w_0_4}>
          <p className={styles.text_base_5}>{option.name}</p>

          <div className={styles.mt_1_5_6}>
            <span className={styles.text_sm_7}>
              {formatInr(option.ackoDrivePriceInr)}
            </span>
            <span className={styles.text_xs_8}>
              {formatInr(option.onRoadListPriceInr)}
            </span>
            {savingsInr > 0 ? (
              <span className={styles.text_xs_9}>
                Save {formatInr(savingsInr)}
              </span>
            ) : null}
          </div>

          <div className={styles.mt_2_10}>
            <p className={cn(styles.text_xs_14, deliveryTextClass)}>
              {option.deliveryLine}
            </p>
            <span className={styles.relative_11} aria-hidden>
              <Image
                src={deliveryIconSrc}
                alt=""
                width={16}
                height={16}
                className={styles.size_4_12}
                unoptimized
                sizes="16px"
              />
            </span>
          </div>
        </div>
      </div>

      {!readOnly ? (
        <span className={styles.mt_0_5_13}>
          <ModifySelectionRadioIndicator selected={selected} />
        </span>
      ) : null}
    </div>
  );

  if (readOnly) {
    return <div className={cardClassName}>{cardBody}</div>;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cardClassName}
    >
      {cardBody}
    </button>
  );
}
