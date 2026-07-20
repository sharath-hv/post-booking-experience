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
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import {
  formatModifySelectionVariantSpecs,
  modifySelectionVariantSavingsInr,
  type ModifySelectionVariantOption,
} from "@/lib/modify-selection-variants-content";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionVariantCard.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function formatInrLakhLabel(amount: number) {
  const lakhs = amount / 100_000;
  const n = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1);
  return `₹${n} L`;
}

type ModifySelectionVariantCardProps = {
  option: ModifySelectionVariantOption;
  selected: boolean;
  onSelect?: () => void;
  readOnly?: boolean;
};

/**
 * Variant option row — Figma 2682:9105 (modify-selection / change variant).
 */
export function ModifySelectionVariantCard({
  option,
  selected,
  onSelect,
  readOnly = false,
}: ModifySelectionVariantCardProps) {
  const savingsInr = modifySelectionVariantSavingsInr(option);
  const deliveryIconSrc = option.isExpressDelivery
    ? BOOKING_CONFIRMED_ASSETS.expressDelivery
    : getBookingDeliveryIconSrc("standard");
  const deliveryTextClass = option.isExpressDelivery
    ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
    : BOOKING_STANDARD_DELIVERY_TEXT_CLASS;
  const deliveryParts = splitBookingDeliveryLine(option.deliveryLine);

  const cardClassName = modifySelectionSelectableCardClassName(selected, readOnly, styles.p4);

  const cardBody = (
    <>
      <div className={styles.flex_0}>
        <p className={styles.min_w_0_1}>{option.name}</p>
        {!readOnly ? (
          <span className={styles.mt_0_5_2}>
            <ModifySelectionRadioIndicator selected={selected} />
          </span>
        ) : null}
      </div>

      <p className={styles.mt_0_5_3}>
        {formatModifySelectionVariantSpecs(option)}
      </p>

      <div className={styles.mt_1_5_4}>
        <span className={styles.text_sm_5}>
          {formatInrLakhLabel(option.ackoDrivePriceInr)}
        </span>
        <span className={styles.text_xs_6}>
          {formatInrLakhLabel(option.onRoadListPriceInr)}
        </span>
        {savingsInr > 0 ? (
          <span className={styles.text_xs_7}>
            Save {formatInr(savingsInr)}
          </span>
        ) : null}
      </div>

      <div className={styles.mt_2_8}>
        <p className={cn(styles.text_xs_12, deliveryTextClass)}>
          {deliveryParts ? (
            <>
              {deliveryParts.prefix}
              <span className={styles.font_medium_9}>{deliveryParts.date}</span>
            </>
          ) : (
            option.deliveryLine
          )}
        </p>
        <span className={styles.relative_10} aria-hidden>
          <Image
            src={deliveryIconSrc}
            alt=""
            width={16}
            height={16}
            className={styles.size_4_11}
            unoptimized
            sizes="16px"
          />
        </span>
      </div>
    </>
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
