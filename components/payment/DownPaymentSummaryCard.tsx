"use client";

import styles from "./DownPaymentSummaryCard.module.scss";


export type DownPaymentSummaryCardProps = {
  /** When `full_payment`, row labels match the full-payment journey. */
  variant?: "down_payment" | "full_payment" | "booking_payment";
  /** Total down payment commitment (e.g. ₹3,63,780). */
  downPaymentTotalInr: number;
  /** Already paid across instalments so far (e.g. ₹1,00,000). */
  amountPaidInr: number;
  /** Remaining balance to be paid (e.g. ₹2,63,780). */
  remainingAmountInr: number;
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Down-payment progress summary shown on the “pay remaining down payment” screen.
 * Mirrors Figma node 2154:7510 — total / paid / dashed divider / remaining (emphasised).
 */
export function DownPaymentSummaryCard({
  variant = "down_payment",
  downPaymentTotalInr,
  amountPaidInr,
  remainingAmountInr,
}: DownPaymentSummaryCardProps) {
  const totalLabel =
    variant === "full_payment"
      ? "Amount for your new car"
      : variant === "booking_payment"
        ? "ACKO Drive price"
        : "Car down payment";
  const paidLabel =
    variant === "full_payment"
      ? "Paid so far"
      : variant === "booking_payment"
        ? "Booking amount paid"
        : "Amount paid";
  const remainingLabel =
    variant === "booking_payment" ? "Amount to pay" : "Remaining amount";
  const ariaLabel =
    variant === "full_payment"
      ? "Full payment summary"
      : variant === "booking_payment"
        ? "Payment summary"
        : "Down payment summary";

  return (
    <section
      className={[styles.w_full_0, "card-elevated"].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      <dl className={styles.m_0_1}>
        <div className={styles.flex_2}>
          <dt className={styles.text_xs_3}>
            {totalLabel}
          </dt>
          <dd className={styles.text_xs_4}>
            {formatInr(downPaymentTotalInr)}
          </dd>
        </div>
        <div className={styles.flex_2}>
          <dt className={styles.text_xs_3}>
            {paidLabel}
          </dt>
          <dd className={styles.text_xs_4}>
            {formatInr(amountPaidInr)}
          </dd>
        </div>

        <hr className={styles.my_0_5} />

        <div className={styles.flex_2}>
          <dt className={styles.text_sm_6}>
            {remainingLabel}
          </dt>
          <dd className={styles.text_sm_7}>
            {formatInr(remainingAmountInr)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
