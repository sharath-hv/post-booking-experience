"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

import { MODIFY_SELECTION_SUMMARY_CARD_CLASS } from "@/components/kyc/modify-selection-option-card-ui";
import styles from "./ModifySelectionReviewPaymentSummary.module.scss";
import { cn } from "@/lib/utils";

import {
  formatModifySelectionInr,
  formatModifySelectionInrSigned,
  MODIFY_SELECTION_OTHER_CHARGES_LINE_ITEMS,
  MODIFY_SELECTION_REVIEW_PAY_ACKO_DRIVE_PRICE_LABEL,
  type ModifySelectionReviewPaySummary,
} from "@/lib/modify-selection-review-pay-content";

type CollapsibleRowProps = {
  label: string;
  amount: string;
  amountClassName?: string;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

function CollapsiblePriceRow({
  label,
  amount,
  amountClassName = styles.textInk,
  open,
  onToggle,
  children,
}: CollapsibleRowProps) {
  return (
    <div>
      <button
        type="button"
        className={styles.flex_0}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.flex_1}>
          <span className={styles.text_sm_2}>{label}</span>
          <ChevronUp
            className={cn(styles.size_4_0, open ? "" : styles.rotate_180_0)}
            aria-hidden
            strokeWidth={2}
          />
        </span>
        <span className={cn(styles.shrink_0_1, amountClassName)}>
          {amount}
        </span>
      </button>
      {open && children ? <div className={styles.mt_3_3}>{children}</div> : null}
    </div>
  );
}

type ModifySelectionReviewPaymentSummaryProps = {
  summary: ModifySelectionReviewPaySummary;
};

/**
 * ACKO Drive car price — single composed card; breakup on demand.
 */
export function ModifySelectionReviewPaymentSummary({
  summary,
}: ModifySelectionReviewPaymentSummaryProps) {
  const [breakupOpen, setBreakupOpen] = useState(false);
  const [otherChargesOpen, setOtherChargesOpen] = useState(false);
  const [totalDiscountOpen, setTotalDiscountOpen] = useState(false);

  return (
    <section
      className={styles.section}
      aria-labelledby="modify-selection-car-price-heading"
    >
      <div className={cn(styles.card, MODIFY_SELECTION_SUMMARY_CARD_CLASS)}>
        <button
          type="button"
          className={styles.summaryToggle}
          onClick={() => setBreakupOpen((open) => !open)}
          aria-expanded={breakupOpen}
        >
          <span
            id="modify-selection-car-price-heading"
            className={styles.summaryLabel}
          >
            {MODIFY_SELECTION_REVIEW_PAY_ACKO_DRIVE_PRICE_LABEL}
          </span>
          <span className={styles.summaryAmountWrap}>
            <span className={styles.summaryAmount}>
              {formatModifySelectionInr(summary.ackoDrivePriceInr)}
            </span>
            <ChevronUp
              className={cn(styles.size_4_0, breakupOpen ? "" : styles.rotate_180_0)}
              aria-hidden
              strokeWidth={2}
            />
          </span>
        </button>

        {breakupOpen ? (
          <div className={styles.breakupBody}>
            <div className={styles.flex_7}>
              <span className={styles.text_sm_2}>Ex-showroom price</span>
              <span className={styles.text_sm_8}>
                {formatModifySelectionInr(summary.exShowroomPriceInr)}
              </span>
            </div>

            <div className={styles.mt_4_9}>
              <CollapsiblePriceRow
                label="Other charges"
                amount={formatModifySelectionInr(summary.otherChargesTotalInr)}
                open={otherChargesOpen}
                onToggle={() => setOtherChargesOpen((v) => !v)}
              >
                <div className={styles.space_y_3_10}>
                  {MODIFY_SELECTION_OTHER_CHARGES_LINE_ITEMS.map((row) => (
                    <div key={row.label} className={styles.flex_7}>
                      <span className={styles.text_xs_11}>{row.label}</span>
                      <span className={styles.text_xs_12}>
                        {formatModifySelectionInr(row.amountInr)}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsiblePriceRow>
            </div>

            <hr className={styles.my_4_13} />

            <CollapsiblePriceRow
              label="Total discount"
              amount={formatModifySelectionInrSigned(-summary.totalDiscountInr)}
              amountClassName={styles.textGreen}
              open={totalDiscountOpen}
              onToggle={() => setTotalDiscountOpen((v) => !v)}
            >
              <div className={styles.rounded_lg_14}>
                <div className={styles.flex_7}>
                  <span className={styles.text_xs_11}>ACKO Drive discount</span>
                  <span className={styles.text_xs_15}>
                    {formatModifySelectionInrSigned(-summary.ackoDriveDiscountInr)}
                  </span>
                </div>
              </div>
            </CollapsiblePriceRow>
          </div>
        ) : null}
      </div>
    </section>
  );
}
