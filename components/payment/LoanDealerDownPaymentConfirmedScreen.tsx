"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import { BANK_DISBURSEMENT_INR } from "@/components/payment/loan-amount-demo-constants";

const DEALER_NAME = "Advaith Hyundai";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function parseLoanAmount(raw: string | null): number {
  if (!raw) return BANK_DISBURSEMENT_INR;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : BANK_DISBURSEMENT_INR;
}

/**
 * Dealer has confirmed the down payment — Shivi instructs the bank to disburse.
 * Bridges loan-sanctioned → loan-disbursement-received; the bank disbursement
 * is now in flight (AmountReceivedCard in "processing" state).
 */
export function LoanDealerDownPaymentConfirmedScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );

  const says = useMemo(
    () => [
      `${DEALER_NAME} has confirmed your down payment, Sharath.`,
      `I've instructed ${bank.name} to disburse ${formatInr(loanAmountInr)} to the dealer. Nothing more needed from you — I'll let you know the moment the bank confirms.`,
    ],
    [bank.name, loanAmountInr],
  );

  const disbursementReceivedHref = useMemo(() => {
    const params = new URLSearchParams();
    if (bankId) params.set("bank", bankId);
    params.set("loan_amount", String(loanAmountInr));
    return `/payment/loan-disbursement-received?${params.toString()}`;
  }, [bankId, loanAmountInr]);

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <AmountReceivedCard
          amountInr={loanAmountInr}
          title={`${bank.name} disbursement — in progress`}
          status="processing"
          rows={[{ label: "Releasing to", value: DEALER_NAME }]}
          note="Typically completes within 1–2 business days."
        />
      }
      timeSkip={{ label: "Once the bank disburses", href: disbursementReceivedHref }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
