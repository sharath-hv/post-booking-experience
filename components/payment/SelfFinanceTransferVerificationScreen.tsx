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
import { PARTNER_DEALER_LABEL, PARTNER_DEALER_LABEL_CAPITALIZED } from "@/lib/dealer-attribution-content";

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
 * Self finance — Shivi is verifying the bank transfer with the dealer.
 * Shown after the user confirms the bank has transferred the loan amount.
 */
export function SelfFinanceTransferVerificationScreen() {
  const searchParams = useSearchParams();
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );

  const says = useMemo(
    () => [
      "Checking with the dealer now.",
      `I'm checking with ${PARTNER_DEALER_LABEL} to confirm they've received the ${formatInr(loanAmountInr)} from your bank.`,
    ],
    [loanAmountInr],
  );

  const nextHref = useMemo(
    () => `/payment/self-finance-transfer-confirmed?loan_amount=${loanAmountInr}`,
    [loanAmountInr],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className="flex flex-col gap-4">
          <AmountReceivedCard
            amountInr={loanAmountInr}
            title="Bank transfer - verifying with dealer"
            status="processing"
            rows={[
              { label: "Sent to", value: PARTNER_DEALER_LABEL_CAPITALIZED },
            ]}
            note="Confirmation typically takes 1-2 business days."
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
