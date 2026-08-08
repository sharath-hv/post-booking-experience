"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard, NextStepCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import {
  bankLoanTermsForId,
  formatBankRate,
} from "@/components/payment/bank-loan-terms";
import styles from "./LoanSanctionedScreen.module.scss";

import { BANK_DISBURSEMENT_INR } from "@/lib/loan-amount-demo-constants";
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

/**
 * Loan approved — Shivi notifies the user, explains the dealer-call down-payment
 * flow, and waits for the user to confirm the payment is arranged before
 * instructing the bank to disburse.
 */
export function LoanSanctionedScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const bankTerms = useMemo(() => bankLoanTermsForId(bankId), [bankId]);

  const says = useMemo(
    () => [
      "Your loan is approved, Sharath.",
      `${bank.name} has sanctioned ${formatInr(BANK_DISBURSEMENT_INR)} at ${formatBankRate(bankTerms)}. ${PARTNER_DEALER_LABEL_CAPITALIZED} will call you to arrange the down payment. Pay it directly to them.`,
      `Once they confirm receipt, I'll instruct ${bank.name} to release the funds to the dealer.`,
    ],
    [bank.name, bankTerms],
  );

  const dealerConfirmedHref = useMemo(() => {
    const params = new URLSearchParams();
    if (bankId) params.set("bank", bankId);
    params.set("loan_amount", String(BANK_DISBURSEMENT_INR));
    return `/payment/down-payment-dealer-confirmed?${params.toString()}`;
  }, [bankId]);

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className={styles.flex_0}>
          <AmountReceivedCard
            amountInr={BANK_DISBURSEMENT_INR}
            title="Approved loan amount"
            status="received"
            variant="glass"
            rows={[{ label: "Bank", value: bank.name }]}
          />
          <NextStepCard
            title={`Watch for ${PARTNER_DEALER_LABEL}'s call`}
            body="Pick up their call. They'll share the payment details so you can pay them directly."
          />
        </div>
      }
      dateHolder="you"
      replies={[
        {
          label: "I've paid the down payment",
          href: dealerConfirmedHref,
          echo: "I've paid the down payment",
        },
      ]}
      callLabel="Questions on the loan? I can call you"
      showMenu
    />
  );
}
