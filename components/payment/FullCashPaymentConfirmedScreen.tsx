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
import { buildPayInsurancePremiumHref, FULL_PAYMENT_BANK_ID } from "@/lib/paymentUrls";

const DEALER_NAME = "Advaith Hyundai";

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
      `${DEALER_NAME} has confirmed receipt. Delivery prep starts now, and nothing more is needed from you until just before the car arrives.`,
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
        <div className="flex flex-col gap-4">
          <AmountReceivedCard
            amountInr={carAmountInr}
            title={`Received by ${DEALER_NAME}`}
            status="received"
            rows={[{ label: "Paid to", value: DEALER_NAME }]}
          />
          <ShimmerInfoCard icon="info">
            <strong>One thing still ahead:</strong>{` your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "When your car's nearly ready", href: insuranceHref }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
