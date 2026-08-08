"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import {
  cashDownPaymentDueInr,
  SELF_FINANCE_LOAN_DEFAULT_INR,
} from "@/lib/loan-amount-demo-constants";
import { NAMED_DEALER_LABEL, NAMED_DEALER_LABEL_CAPITALIZED } from "@/lib/dealer-attribution-content";
import { buildMarginMoneySlipActionHref } from "@/lib/paymentUrls";


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
 * Card layout mirrors ACKO Drive {@link LoanDealerDownPaymentConfirmedScreen} disbursement wait.
 */
export function SelfFinanceTransferVerificationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bank = searchParams.get("bank");
  const originalDownPayment = searchParams.get("original_down_payment");
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );
  const downPaymentInr = useMemo(() => {
    if (originalDownPayment != null && Number.isFinite(Number(originalDownPayment))) {
      return Math.round(Number(originalDownPayment));
    }
    return cashDownPaymentDueInr(loanAmountInr);
  }, [loanAmountInr, originalDownPayment]);

  const says = useMemo(
    () => [
      `Checking with ${NAMED_DEALER_LABEL} now.`,
      `I'm checking with ${NAMED_DEALER_LABEL} to confirm they've received the ${formatInr(loanAmountInr)} from your bank.`,
    ],
    [loanAmountInr],
  );

  const nextHref = useMemo(
    () => `/payment/self-finance-transfer-confirmed?loan_amount=${loanAmountInr}`,
    [loanAmountInr],
  );

  const onBack = useCallback(() => {
    // Land on slip-ready beat, not the dealer-check wait.
    router.replace(
      buildMarginMoneySlipActionHref({
        bank,
        loanAmount: String(loanAmountInr),
        originalDownPaymentInr:
          originalDownPayment != null && Number.isFinite(Number(originalDownPayment))
            ? Number(originalDownPayment)
            : null,
        slipReady: true,
      }),
    );
  }, [bank, loanAmountInr, originalDownPayment, router]);

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <AmountReceivedCard
          amountInr={loanAmountInr}
          title="Bank transfer · in progress"
          status="processing"
          variant="glass"
          rows={[
            { label: "Down payment confirmed", value: formatInr(downPaymentInr) },
            { label: "Sent to", value: NAMED_DEALER_LABEL_CAPITALIZED },
          ]}
          note="Typically completes within 1-2 business days."
        />
      }
      timeSkip={{ label: "Once dealer confirms", href: nextHref }}
      onBack={onBack}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
