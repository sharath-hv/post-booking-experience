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
import { buildPayInsurancePremiumHref, FULL_PAYMENT_BANK_ID } from "@/helpers/paymentUrls";
import styles from "./FullCashPaymentConfirmedScreen.module.scss";

import {
  NAMED_DEALER_LABEL,
  NAMED_DEALER_LABEL_CAPITALIZED,
} from "@/constants/dealer-attribution-content";

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
 * Full cash payment — dealer has confirmed receipt of the car amount.
 * Mirrors {@link SelfFinanceTransferConfirmedScreen} for the full-cash journey.
 */
export function FullCashPaymentConfirmedScreen() {
  const searchParams = useSearchParams();
  const carAmountInr = useMemo(
    () => parseCarAmount(searchParams.get("car_amount")),
    [searchParams],
  );

  const says = useMemo(
    () => [
      "Payment confirmed, Sharath.",
      `${NAMED_DEALER_LABEL_CAPITALIZED} has confirmed receipt. Delivery prep starts now, and nothing more is needed from you until just before the car arrives.`,
    ],
    [],
  );

  const insuranceHref = useMemo(
    () => buildPayInsurancePremiumHref({ bank: FULL_PAYMENT_BANK_ID }),
    [],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className={styles.flex_0}>
          <AmountReceivedCard
            variant="glass"
            amountInr={carAmountInr}
            title={`Received by ${NAMED_DEALER_LABEL}`}
            status="received"
            rows={[{ label: "Paid to", value: NAMED_DEALER_LABEL_CAPITALIZED }]}
          />
          <ShimmerInfoCard lead="One thing still ahead">
            {`Your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "When your car's nearly ready", href: insuranceHref }}
      callLabel="Need help?"
      showMenu
    />
  );
}
