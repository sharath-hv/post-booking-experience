"use client";

import {
  FULL_PAYMENT_CAR_AMOUNT_INR,
  FULL_PAYMENT_CAR_DUE_LABEL,
  FULL_PAYMENT_INSURANCE_DUE_LINE,
  FULL_PAYMENT_INSURANCE_INR,
  ON_ROAD_PRICE_INR,
} from "@/components/payment/loan-amount-demo-constants";
import styles from "./FullPaymentAmountDueCard.module.scss";

export type FullPaymentAmountDueCardProps = {
  /**
   * `breakdown` — car + insurance rows (confirmation screen).
   * `car_only` — single new-car row (remaining full-payment hero).
   */
  variant?: "breakdown" | "car_only";
  /** Total due now; defaults depend on `variant`. */
  amountDueInr?: number;
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function splitCarAndInsurance(amountDueInr: number) {
  const total = Math.max(0, Math.round(amountDueInr));
  const fullTotal = ON_ROAD_PRICE_INR;
  if (total >= fullTotal) {
    return {
      carAmountInr: FULL_PAYMENT_CAR_AMOUNT_INR,
      insuranceAmountInr: FULL_PAYMENT_INSURANCE_INR,
    };
  }
  const carShare = FULL_PAYMENT_CAR_AMOUNT_INR / fullTotal;
  const carAmountInr = Math.round(total * carShare);
  const insuranceAmountInr = Math.max(0, total - carAmountInr);
  return { carAmountInr, insuranceAmountInr };
}

type AmountRowProps = {
  label: string;
  amountInr: number;
  /** Full secondary line (e.g. custom insurance copy). */
  dueLine?: string;
  /** Date label when `dueLine` is omitted — rendered as “Due by …”. */
  dueByLabel?: string;
  showDivider?: boolean;
};

function AmountRow({ label, amountInr, dueLine, dueByLabel, showDivider }: AmountRowProps) {
  const secondaryLine = dueLine ?? (dueByLabel ? `Due by ${dueByLabel}` : null);
  return (
    <>
      {showDivider ? (
        <hr className={styles.my_0_0} />
      ) : null}
      <div className={styles.flex_1}>
        <div className={styles.flex_2}>
          <p className={styles.text_left_3}>{label}</p>
          <p className={styles.shrink_0_4}>
            {formatInr(amountInr)}
          </p>
        </div>
        {secondaryLine ? (
          <p className={styles.text_left_5}>
            {secondaryLine}
          </p>
        ) : null}
      </div>
    </>
  );
}

/**
 * Full payment — car + insurance breakdown before any instalments.
 * Same card shell as {@link DownPaymentSummaryCard}.
 */
export function FullPaymentAmountDueCard({
  variant = "breakdown",
  amountDueInr,
}: FullPaymentAmountDueCardProps) {
  const resolvedAmount =
    amountDueInr ??
    (variant === "car_only" ? FULL_PAYMENT_CAR_AMOUNT_INR : ON_ROAD_PRICE_INR);
  const { carAmountInr, insuranceAmountInr } = splitCarAndInsurance(resolvedAmount);

  if (variant === "car_only") {
    return (
      <section
        className={[styles.w_full_6, "card-elevated"].filter(Boolean).join(" ")}
        aria-label="Amount for your new car"
      >
        <AmountRow
          label="Amount for your new car"
          amountInr={carAmountInr}
        />
      </section>
    );
  }

  return (
    <section
      className={[styles.w_full_6, "card-elevated"].filter(Boolean).join(" ")}
      aria-label="Amount to pay"
    >
      <div className={styles.flex_7}>
        <AmountRow
          label="Amount for your new car"
          amountInr={carAmountInr}
          dueByLabel={FULL_PAYMENT_CAR_DUE_LABEL}
        />
        <AmountRow
          label="Amount for car insurance"
          amountInr={insuranceAmountInr}
          dueLine={FULL_PAYMENT_INSURANCE_DUE_LINE}
          showDivider
        />
      </div>
    </section>
  );
}
