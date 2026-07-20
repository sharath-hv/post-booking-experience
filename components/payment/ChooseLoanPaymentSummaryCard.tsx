"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

import {
  ACKO_DRIVE_DISCOUNT_INR,
  ON_ROAD_LIST_PRICE_INR,
  ON_ROAD_PRICE_INR,
} from "@/components/payment/loan-amount-demo-constants";
import { BOOKING_PAYMENT_SUMMARY_INR } from "@/lib/payment-summary-demo";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";
import styles from "./ChooseLoanPaymentSummaryCard.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

export type ChooseLoanPaymentSummaryCardProps = {
  loanAmountInr: number;
  /** Full or remaining down payment — footer amount. */
  downPaymentAmountInr: number;
  /** When set, shows a “Down payment paid” row; with partial pay, footer shows remaining. */
  downPaymentPaidInr?: number;
  /** Hides the footer when the full down payment is received. */
  downPaymentFullyPaid?: boolean;
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
};

/**
 * Payment summary for choose-loan — Figma choose-loan flow.
 * ACKO Drive price breakdown, booking paid, selected loan, and down payment due.
 */
export function ChooseLoanPaymentSummaryCard({
  loanAmountInr,
  downPaymentAmountInr,
  downPaymentPaidInr,
  downPaymentFullyPaid = false,
  variant = "default",
}: ChooseLoanPaymentSummaryCardProps) {
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  const showDownPaymentPaidRow =
    downPaymentPaidInr != null && downPaymentPaidInr > 0;
  const showRemainingFooter = showDownPaymentPaidRow && !downPaymentFullyPaid;

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
            {formatInr(ON_ROAD_PRICE_INR)}
          </span>
        </button>

        {priceBreakdownOpen ? (
          <div className={cn(styles.mt_3_15, isGlass && styles.border_16)}>
            <div className={styles.flex_4}>
              <span className={styles.text_xs_5}>On-road price</span>
              <span className={styles.text_xs_6}>
                {formatInr(ON_ROAD_LIST_PRICE_INR)}
              </span>
            </div>
            <div className={styles.mt_3_7}>
              <span className={styles.text_xs_5}>ACKO Drive discount</span>
              <span className={styles.text_xs_8}>
                -{formatInr(ACKO_DRIVE_DISCOUNT_INR)}
              </span>
            </div>
          </div>
        ) : null}

        <hr className={styles.my_4_9} />

        <div className={styles.flex_4}>
          <span className={styles.text_sm_2}>Booking amount paid</span>
          <span className={styles.text_sm_10}>
            {formatInr(BOOKING_PAYMENT_SUMMARY_INR.bookingAmountPaidInr)}
          </span>
        </div>

        <hr className={styles.my_4_9} />

        <div className={styles.flex_4}>
          <span className={styles.text_sm_2}>Loan amount</span>
          <span className={styles.text_sm_10}>
            {formatInr(loanAmountInr)}
          </span>
        </div>

        {showDownPaymentPaidRow ? (
          <>
            <hr className={styles.my_4_9} />
            <div className={styles.flex_4}>
              <span className={styles.text_sm_2}>Down payment paid</span>
              <span className={styles.text_sm_10}>
                {formatInr(downPaymentPaidInr)}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {showRemainingFooter || !showDownPaymentPaidRow ? (
        <div
          className={cn(
            styles.flex_17,
            isGlass ? styles.border_t_18 : styles.bg_f5f5f5__19,
          )}
        >
          <span className={styles.text_base_11}>
            {showRemainingFooter ? "Remaining down payment" : "Down payment amount"}
          </span>
          <span className={styles.text_base_11}>
            {formatInr(downPaymentAmountInr)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
