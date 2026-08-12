"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { ShimmerInfoCard } from "@/components/molecules/ShimmerInfoCard";
import {
  FULL_PAYMENT_CAR_AMOUNT_INR,
  FULL_PAYMENT_INSURANCE_INR,
} from "@/constants/loan-amount-demo-constants";
import { NAMED_DEALER_LABEL, NAMED_DEALER_LABEL_CAPITALIZED } from "@/constants/dealer-attribution-content";
import styles from "./FullCashPaymentVerificationScreen.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function parseCarAmount(raw: string | null): number {
  if (!raw) return FULL_PAYMENT_CAR_AMOUNT_INR;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : FULL_PAYMENT_CAR_AMOUNT_INR;
}

/**
 * Full cash payment — Shivi is verifying with the dealer that the transfer was received.
 * Mirrors {@link SelfFinanceTransferVerificationScreen} for the full-cash journey.
 */
export function FullCashPaymentVerificationScreen() {
  const searchParams = useSearchParams();
  const carAmountInr = useMemo(
    () => parseCarAmount(searchParams.get("car_amount")),
    [searchParams],
  );

  const says = [
    `Checking with ${NAMED_DEALER_LABEL} now.`,
    `I've notified ${NAMED_DEALER_LABEL} about your transfer. I'll update you here as soon as they confirm receipt.`,
  ];

  const nextHref = useMemo(
    () => `/payment/full-cash-payment-confirmed?car_amount=${carAmountInr}`,
    [carAmountInr],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className={styles.flex_0}>
          <AmountReceivedCard
            variant="glass"
            amountInr={carAmountInr}
            title="Payment · verifying with dealer"
            status="processing"
            rows={[{ label: "Sent to", value: NAMED_DEALER_LABEL_CAPITALIZED }]}
          />
          <ShimmerInfoCard lead="One thing still ahead">
            {`Your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "Once dealer confirms", href: nextHref }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
