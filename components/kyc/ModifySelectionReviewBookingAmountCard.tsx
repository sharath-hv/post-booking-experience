"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

import {
  formatModifySelectionInr,
  formatModifySelectionInrSigned,
  getModifySelectionBookingAmountCardCopy,
  MODIFY_SELECTION_REVIEW_PAY_BREAKDOWN_TOGGLE,
  type ModifySelectionReviewPaySummary,
} from "@/lib/modify-selection-review-pay-content";
import { MODIFY_SELECTION_SUMMARY_CARD_CLASS } from "@/components/molecules/modify-selection-option-card-ui";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionReviewBookingAmountCard.module.scss";

export const MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID = "modify-selection-booking-amount";

type ModifySelectionReviewBookingAmountCardProps = {
  summary: ModifySelectionReviewPaySummary;
  sectionRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Booking-amount card IA:
 * - Pay cases → “Amount due for this change” + amount
 * - Surplus (lower) → credit amount as hero (not ₹0)
 * - Covered same lock, no fee → omit entirely (nothing to explain)
 */
export function ModifySelectionReviewBookingAmountCard({
  summary,
  sectionRef,
}: ModifySelectionReviewBookingAmountCardProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const copy = getModifySelectionBookingAmountCardCopy(summary);
  const hasFee = summary.changeSelectionFeeInr > 0;

  // Same booking amount, no fee — card would only say “nothing to pay.”
  if (copy.caseId === "same") {
    return null;
  }

  return (
    <section
      id={MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID}
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="modify-selection-due-today-heading"
    >
      <div className={cn(styles.card, MODIFY_SELECTION_SUMMARY_CARD_CLASS)}>
        <div
          className={cn(
            styles.hero,
            copy.heroAmountTone === "credit" ? styles.heroCredit : styles.heroPay,
          )}
        >
          <div className={styles.amountBlock}>
            <h2 id="modify-selection-due-today-heading" className={styles.dueLabel}>
              {copy.dueLabel}
            </h2>
            {copy.heroAmountInr != null ? (
              <p
                className={cn(
                  styles.dueAmount,
                  copy.heroAmountTone === "credit" ? styles.dueAmountCredit : "",
                )}
              >
                {formatModifySelectionInr(copy.heroAmountInr)}
              </p>
            ) : null}
          </div>

          <p className={styles.situation} role="status">
            {copy.whyLine}
          </p>
        </div>

        <div className={styles.breakdown}>
          <button
            type="button"
            className={styles.breakdownToggle}
            onClick={() => setBreakdownOpen((open) => !open)}
            aria-expanded={breakdownOpen}
          >
            <span>{MODIFY_SELECTION_REVIEW_PAY_BREAKDOWN_TOGGLE}</span>
            <ChevronUp
              className={cn(styles.chevron, breakdownOpen ? "" : styles.chevronClosed)}
              aria-hidden
              strokeWidth={2}
            />
          </button>

          {breakdownOpen ? (
            <div className={styles.breakdownRows}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>New booking amount</span>
                <span className={styles.rowValue}>
                  {formatModifySelectionInr(summary.newBookingAmountInr)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Already paid</span>
                <span className={styles.rowValue}>
                  {formatModifySelectionInrSigned(-summary.bookingAmountPaidInr)}
                </span>
              </div>
              {hasFee ? (
                <div className={styles.row}>
                  <span className={styles.rowLabel}>One-time change fee</span>
                  <span className={styles.rowValue}>
                    {formatModifySelectionInr(summary.changeSelectionFeeInr)}
                  </span>
                </div>
              ) : null}
              <div className={styles.breakdownDivider} aria-hidden />
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>{copy.totalLabel}</span>
                <span className={styles.totalValue}>
                  {formatModifySelectionInr(copy.totalAmountInr)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
