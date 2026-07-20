"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import {
  FULL_PAYMENT_CAR_AMOUNT_INR,
  FULL_PAYMENT_INSURANCE_INR,
} from "@/components/payment/loan-amount-demo-constants";
import { PARTNER_DEALER_LABEL, PARTNER_DEALER_LABEL_CAPITALIZED } from "@/lib/dealer-attribution-content";
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
    "Checking with the dealer now.",
    `I've notified ${PARTNER_DEALER_LABEL} about your transfer. I'll update you here as soon as they confirm receipt.`,
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
            amountInr={carAmountInr}
            title="Payment · verifying with dealer"
            status="processing"
            rows={[{ label: "Sent to", value: PARTNER_DEALER_LABEL_CAPITALIZED }]}
          />
          <ShimmerInfoCard icon="info">
            <strong>One thing still ahead:</strong>{` your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "Once dealer confirms", href: nextHref }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
