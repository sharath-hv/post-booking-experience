"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import {
  BANK_DISBURSEMENT_INR,
  cashDownPaymentDueInr,
  FULL_PAYMENT_INSURANCE_INR,
} from "@/components/payment/loan-amount-demo-constants";


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

  const downPaymentInr = useMemo(() => cashDownPaymentDueInr(loanAmountInr), [loanAmountInr]);

  const says = useMemo(
    () => [
      "Down payment confirmed.",
      `${DEALER_NAME} confirmed your ${formatInr(downPaymentInr)} — all good on my end.`,
      `I've asked ${bank.name} to release the funds to the dealer. Nothing more needed from you — I'll let you know the moment it lands.`,
    ],
    [bank.name, downPaymentInr, loanAmountInr],
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
        <div className="flex flex-col gap-4">
          <AmountReceivedCard
            amountInr={loanAmountInr}
            title={`${bank.name} disbursement — in progress`}
            status="processing"
            rows={[
              { label: "Down payment confirmed", value: formatInr(downPaymentInr) },
              { label: "Releasing to", value: DEALER_NAME },
            ]}
            note="Typically completes within 1–2 business days."
          />
          <ShimmerInfoCard icon="info">
            {`One thing still ahead: your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "Once the bank disburses", href: disbursementReceivedHref }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
