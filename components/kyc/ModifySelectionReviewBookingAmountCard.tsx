"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronUp } from "lucide-react";

import moneyIcon from "@/assets/money.svg";
import warningAmberIcon from "@/assets/Warning amber.svg";
import {
  formatModifySelectionInr,
  formatModifySelectionInrSigned,
  MODIFY_SELECTION_REVIEW_PAY_BREAKDOWN_TOGGLE,
  MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_HEADING,
  MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_LABEL,
  type ModifySelectionReviewPaySummary,
} from "@/lib/modify-selection-review-pay-content";
import { MODIFY_SELECTION_SUMMARY_CARD_CLASS } from "@/components/kyc/modify-selection-option-card-ui";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionReviewBookingAmountCard.module.scss";

export const MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID = "modify-selection-booking-amount";

type ModifySelectionReviewBookingAmountCardProps = {
  summary: ModifySelectionReviewPaySummary;
  sectionRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Due-today hero for review-and-pay — composed card, situation + amount first.
 */
export function ModifySelectionReviewBookingAmountCard({
  summary,
  sectionRef,
}: ModifySelectionReviewBookingAmountCardProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const hasFee = summary.changeSelectionFeeInr > 0;
  const hasSurplus = summary.bookingAmountSurplusInr > 0;

  return (
    <section
      id={MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID}
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="modify-selection-due-today-heading"
    >
      <div className={cn(styles.card, MODIFY_SELECTION_SUMMARY_CARD_CLASS)}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.headingIcon} aria-hidden>
              <Image
                src={moneyIcon}
                alt=""
                width={20}
                height={20}
                className={styles.headingIconImage}
                unoptimized
              />
            </span>
            <div className={styles.heroCopyText}>
              <h2 id="modify-selection-due-today-heading" className={styles.heading}>
                {MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_HEADING}
              </h2>
              {summary.situationLine ? (
                <p className={styles.situation}>{summary.situationLine}</p>
              ) : null}
            </div>
          </div>

          <div className={styles.amountBlock}>
            <div className={styles.amountMain}>
              <p className={styles.dueLabel}>{MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_LABEL}</p>
              <p className={styles.dueAmount}>
                {formatModifySelectionInr(summary.bookingAmountToPayInr)}
              </p>
            </div>
          </div>

          {hasFee || hasSurplus ? (
            <div className={styles.notices}>
              {hasFee ? (
                <p className={styles.feeHint} role="status">
                  <Image
                    src={warningAmberIcon}
                    alt=""
                    width={14}
                    height={14}
                    className={styles.feeHintIcon}
                    unoptimized
                  />
                  <span>
                    {summary.bookingAmountToPayInr === summary.changeSelectionFeeInr
                      ? `One-time change fee of ${formatModifySelectionInr(summary.changeSelectionFeeInr)}`
                      : `Includes ${formatModifySelectionInr(summary.changeSelectionFeeInr)} one-time change fee`}
                  </span>
                </p>
              ) : null}

              {hasSurplus ? (
                <p className={styles.surplusNote}>
                  {formatModifySelectionInr(summary.bookingAmountSurplusInr)} will be
                  adjusted in your final car amount.
                </p>
              ) : null}
            </div>
          ) : null}
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
                <span className={styles.totalLabel}>Amount to be paid</span>
                <span className={styles.totalValue}>
                  {formatModifySelectionInr(summary.bookingAmountToPayInr)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
