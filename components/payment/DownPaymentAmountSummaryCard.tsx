"use client";

import { FULL_PAYMENT_INSURANCE_INR } from "@/components/payment/loan-amount-demo-constants";
import styles from "./DownPaymentAmountSummaryCard.module.scss";


export type DownPaymentAmountSummaryCardProps = {
  /** Car down payment due now in INR (total down payment minus insurance). */
  downPaymentAmountInr: number;
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Pay-down-payment hero — label + amount row (aligned with sanctioned card).
 */
export function DownPaymentAmountSummaryCard({
  downPaymentAmountInr,
}: DownPaymentAmountSummaryCardProps) {
  return (
    <section
      className={[styles.w_full_0, "card-elevated"].filter(Boolean).join(" ")}
      aria-label="Car down payment summary"
    >
      <dl className={styles.m_0_1}>
        <dt className={styles.text_sm_2}>Car down payment</dt>
        <dd className={styles.text_base_3}>
          {formatInr(downPaymentAmountInr)}
        </dd>
      </dl>

      <hr className={styles.my_3_4} />

      <p className={styles.text_xs_5}>
        The insurance amount of {formatInr(FULL_PAYMENT_INSURANCE_INR)} is due much later — just
        before delivery, when the RTO registration needs it.
      </p>
    </section>
  );
}
