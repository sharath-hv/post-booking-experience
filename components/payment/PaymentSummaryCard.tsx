"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

import { BOOKING_PAYMENT_SUMMARY_INR } from "@/lib/payment-summary-demo";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";
import styles from "./PaymentSummaryCard.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/** Demo payment figures — Figma 2486:11207 */
export const PAYMENT_SUMMARY = {
  ackoDrivePrice: formatInr(BOOKING_PAYMENT_SUMMARY_INR.ackoDrivePriceInr),
  onRoadPrice: formatInr(BOOKING_PAYMENT_SUMMARY_INR.onRoadPriceInr),
  ackoDriveDiscount: `-${formatInr(BOOKING_PAYMENT_SUMMARY_INR.ackoDriveDiscountInr)}`,
  bookingAmountPaid: formatInr(BOOKING_PAYMENT_SUMMARY_INR.bookingAmountPaidInr),
  amountToPay: formatInr(BOOKING_PAYMENT_SUMMARY_INR.amountToPayInr),
} as const;

export type PaymentSummaryCardProps = {
  /** Instalments received toward the car / full-payment commitment (excludes booking lock). */
  paymentPaidInr?: number;
  /** Remaining due before the commitment is complete. */
  amountRemainingInr?: number;
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
};

/**
 * ACKO Drive price, booking amount paid, and amount to pay — shared by payment default hero
 * and manage-booking sheet. Pass `paymentPaidInr` + `amountRemainingInr` for partial full payment.
 */
export function PaymentSummaryCard({
  paymentPaidInr,
  amountRemainingInr,
  variant = "default",
}: PaymentSummaryCardProps = {}) {
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  const showPaymentPaidRow =
    paymentPaidInr != null && paymentPaidInr > 0;
  const showRemainingFooter =
    amountRemainingInr != null &&
    amountRemainingInr > 0 &&
    showPaymentPaidRow;

  const isGlass = variant === "glass";

  return (
    <div
      className={cn(
        isGlass ? OVERLAY_GLASS_CARD_CLASS : styles.overflow_hidden_12, "card-elevated",
      )}
    >
      <div className={cn(styles.px_4_13, !isGlass && styles.bg_white_14)}>
        <button
          type="button"
          className={styles.flex_0}
          onClick={() => setPriceBreakdownOpen((open) => !open)}
          aria-expanded={priceBreakdownOpen}
        >
          <span className={styles.flex_1}>
            <span className={styles.text_sm_2}>ACKO Drive price</span>
            <ChevronUp
              className={cn(styles.size_4_0, priceBreakdownOpen ? "" : styles.rotate_180_0)}
              aria-hidden
              strokeWidth={2}
            />
          </span>
          <span className={styles.shrink_0_3}>
            {PAYMENT_SUMMARY.ackoDrivePrice}
          </span>
        </button>

        {priceBreakdownOpen ? (
          <div className={cn(styles.mt_3_15, isGlass && styles.border_16)}>
            <div className={styles.flex_4}>
              <span className={styles.text_xs_5}>On-road price</span>
              <span className={styles.text_xs_6}>
                {PAYMENT_SUMMARY.onRoadPrice}
              </span>
            </div>
            <div className={styles.mt_3_7}>
              <span className={styles.text_xs_5}>ACKO Drive discount</span>
              <span className={styles.text_xs_8}>
                {PAYMENT_SUMMARY.ackoDriveDiscount}
              </span>
            </div>
          </div>
        ) : null}

        <hr className={styles.my_4_9} />

        <div className={styles.flex_4}>
          <span className={styles.text_sm_2}>Paid so far</span>
          <span className={styles.text_sm_10}>
            {PAYMENT_SUMMARY.bookingAmountPaid}
          </span>
        </div>

        {showPaymentPaidRow ? (
          <>
            <hr className={styles.my_4_9} />
            <div className={styles.flex_4}>
              <span className={styles.text_sm_2}>Amount paid</span>
              <span className={styles.text_sm_10}>
                {formatInr(paymentPaidInr)}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {showRemainingFooter || !showPaymentPaidRow ? (
        <div
          className={cn(
            styles.flex_17,
            !isGlass && styles.bg_white_14,
          )}
        >
          <span className={styles.text_base_11}>Amount to pay</span>
          <span className={styles.text_base_11}>
            {showRemainingFooter
              ? formatInr(amountRemainingInr!)
              : PAYMENT_SUMMARY.amountToPay}
          </span>
        </div>
      ) : null}
    </div>
  );
}
