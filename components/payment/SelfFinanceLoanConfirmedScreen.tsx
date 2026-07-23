"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard, NextStepCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { SELF_FINANCE_LOAN_DEFAULT_INR } from "@/components/payment/loan-amount-demo-constants";
import { buildMarginMoneySlipActionHref } from "@/lib/paymentUrls";
import { PARTNER_DEALER_LABEL, PARTNER_DEALER_LABEL_CAPITALIZED } from "@/lib/dealer-attribution-content";
import styles from "./SelfFinanceLoanConfirmedScreen.module.scss";


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
 * Self finance — Shivi acknowledges the sanctioned loan amount and explains
 * that the dealer will call to arrange the down payment offline.
 */
export function SelfFinanceLoanConfirmedScreen() {
  const searchParams = useSearchParams();
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );

  const says = useMemo(
    () => [
      `Got it, ${formatInr(loanAmountInr)} noted.`,
      `I've let ${PARTNER_DEALER_LABEL} know. They'll call you to confirm the down payment amount and share the details to transfer it directly to them.`,
    ],
    [loanAmountInr],
  );

  const downPaymentPaidHref = buildMarginMoneySlipActionHref({
    bank: "self_finance",
    loanAmount: String(loanAmountInr),
  });

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className={styles.flex_0}>
          <NextStepCard
            title={`Watch for ${PARTNER_DEALER_LABEL}'s call`}
            body="Once they share the payment details, transfer the down payment directly to the dealer."
          />
          <AmountReceivedCard
            amountInr={loanAmountInr}
            title="Loan amount confirmed"
            rows={[
              { label: "Shared with", value: PARTNER_DEALER_LABEL_CAPITALIZED },
            ]}
          />
        </div>
      }
      dateHolder="you"
      replies={[
        {
          label: "I've paid the down payment",
          href: downPaymentPaidHref,
        },
      ]}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
