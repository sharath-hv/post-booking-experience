"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import {
  FULL_PAYMENT_INSURANCE_INR,
  SELF_FINANCE_LOAN_DEFAULT_INR,
} from "@/components/payment/loan-amount-demo-constants";
import { buildPayInsurancePremiumHref } from "@/lib/paymentUrls";
import {
  PARTNER_DEALER_LABEL,
  PARTNER_DEALER_LABEL_CAPITALIZED,
} from "@/lib/dealer-attribution-content";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function parseLoanAmount(raw: string | null): number {
  if (!raw) return SELF_FINANCE_LOAN_DEFAULT_INR;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : SELF_FINANCE_LOAN_DEFAULT_INR;
}

/**
 * Self finance — dealer has confirmed the bank transfer.
 * Mirrors {@link LoanDisbursementReceivedScreen} for the self-finance journey.
 */
export function SelfFinanceTransferConfirmedScreen() {
  const searchParams = useSearchParams();
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );

  const says = useMemo(
    () => [
      "Transfer confirmed, Sharath.",
      `${PARTNER_DEALER_LABEL_CAPITALIZED} has confirmed they received the loan amount. Delivery prep starts now, and nothing more is needed from you until just before the car arrives.`,
    ],
    [],
  );

  const insuranceHref = useMemo(
    () =>
      buildPayInsurancePremiumHref({
        bank: "self_finance",
        loanAmount: String(loanAmountInr),
      }),
    [loanAmountInr],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className="flex flex-col gap-4">
          <AmountReceivedCard
            amountInr={loanAmountInr}
            title={`Received by ${PARTNER_DEALER_LABEL}`}
            status="received"
            rows={[
              { label: "Transferred to", value: PARTNER_DEALER_LABEL_CAPITALIZED },
            ]}
            note="Funds are with the dealer. Delivery prep is now underway."
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
